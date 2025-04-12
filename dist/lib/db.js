"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeSeriesDB = void 0;
/**
 * TimeSeriesDB handles operations for managing and querying time-series data
 * stored in a TimescaleDB database.
 */
class TimeSeriesDB {
    /**
     * Creates an instance of TimeSeriesDB.
     *
     * @param {Pool} pool - A PostgreSQL connection pool.
     *
     * @example
     * const { Pool } = require("pg");
     * const pool = new Pool({
     *   host: "localhost",
     *   port: 5432,
     *   database: "lighthouse_db",
     *   user: "lighthouse_user",
     *   password: "password"
     * });
     * const db = new TimeSeriesDB(pool);
     */
    constructor(pool) {
        this.pool = pool;
    }
    /**
     * Inserts a batch of scraped data records into the 'scraped_data' table.
     *
     * The insertion is performed as a single bulk insert within a transaction,
     * ensuring that either all records are inserted or the transaction rolls back on error.
     *
     * @param {ScrapedData[]} data - An array of scraped data records.
     * @returns {Promise<void>} A Promise that resolves when the data has been successfully inserted.
     *
     * @throws {Error} If the insertion fails, the transaction is rolled back and the error is thrown.
     *
     * @example
     * const data = [{
     *   time: new Date(),
     *   source: "dse_bd",
     *   metric_name: "ABC",
     *   value: 10.5,
     *   metadata: {
     *     high: 11,
     *     low: 10,
     *     close_price: 10.3,
     *     ycp: 10.1,
     *     change: 0.4,
     *     trade_count: 123,
     *     value_mn: 5.6,
     *     volume: 1000
     *   }
     * }];
     * await timeSeriesDB.batchInsert(data);
     */
    async batchInsert(data) {
        if (!data.length) {
            console.warn("No data to insert");
            return;
        }
        const client = await this.pool.connect();
        try {
            await client.query("BEGIN");
            // Prepare values for bulk insert.
            // Each record expands to 5 columns, so we create parameter placeholders dynamically.
            const values = data
                .map((d, i) => `($${i * 5 + 1}, $${i * 5 + 2}, $${i * 5 + 3}, $${i * 5 + 4}, $${i * 5 + 5})`)
                .join(",");
            // Flatten the data into a single array in the order of the columns.
            const flatValues = data.flatMap((d) => [
                d.time,
                d.source,
                d.metric_name,
                d.value,
                d.metadata,
            ]);
            const query = {
                text: `
          INSERT INTO scraped_data(time, source, metric_name, value, metadata)
          VALUES ${values}
        `,
                values: flatValues,
            };
            await client.query(query);
            await client.query("COMMIT");
            console.log(`Successfully inserted ${data.length} records`);
        }
        catch (error) {
            await client.query("ROLLBACK");
            console.error("Database insertion failed:", error);
            throw error;
        }
        finally {
            client.release();
        }
    }
    /**
     * Retrieves the latest unique metrics from the 'scraped_data' table.
     *
     * Returns distinct records per metric_name sorted by the latest time.
     *
     * @param {number} [limit=10] - The maximum number of records to return.
     * @returns {Promise<any>} A Promise resolving to the query result.
     *
     * @example
     * const result = await timeSeriesDB.getLatestMetrics();
     * console.log(result.rows);
     */
    async getLatestMetrics(limit = 10) {
        return this.pool.query(`
      SELECT DISTINCT ON (metric_name)
        time, source, metric_name, value, metadata
      FROM scraped_data
      ORDER BY metric_name, time DESC
      LIMIT $1
    `, [limit]);
    }
    /**
     * Retrieves aggregated metrics data for a given metric within a specified time range.
     *
     * The data is aggregated into time buckets based on the provided interval.
     *
     * @param {string} metric - The metric name to filter by.
     * @param {Date} start - The start time of the range.
     * @param {Date} end - The end time of the range.
     * @param {string} [interval="1 hour"] - The time bucket interval (e.g., "1 hour").
     * @returns {Promise<any>} A Promise resolving to the aggregated query result.
     *
     * @example
     * const result = await timeSeriesDB.getMetricsByTimeRange("ABC", new Date("2021-01-01"), new Date());
     * console.log(result.rows);
     */
    async getMetricsByTimeRange(metric, start, end, interval = "1 hour") {
        return this.pool.query(`
      SELECT 
        time_bucket($1, time) AS bucket,
        metric_name,
        avg(value) as avg_value,
        min(value) as min_value,
        max(value) as max_value,
        count(*) as sample_count
      FROM scraped_data 
      WHERE metric_name = $2 
        AND time BETWEEN $3 AND $4
      GROUP BY bucket, metric_name
      ORDER BY bucket DESC
    `, [interval, metric, start, end]);
    }
    /**
     * Applies compression to the 'scraped_data' table and sets up a compression policy.
     *
     * This method enables TimescaleDB's compression on the table and adds a policy that
     * automatically compresses data older than the specified interval.
     *
     * @param {string} [chunk_interval="7 days"] - The interval after which data chunks will be compressed.
     * @returns {Promise<void>} A Promise that resolves when the policy is applied.
     *
     * @example
     * await timeSeriesDB.setupCompression("7 days");
     */
    async setupCompression(chunk_interval = "7 days") {
        await this.pool.query(`
      ALTER TABLE scraped_data SET (
        timescaledb.compress,
        timescaledb.compress_segmentby = 'metric_name,source'
      );
    `);
        await this.pool.query(`
      SELECT add_compression_policy('scraped_data', INTERVAL '${chunk_interval}');
    `);
    }
}
exports.TimeSeriesDB = TimeSeriesDB;
