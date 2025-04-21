import { Pool } from "pg"
import { ScrapedData } from "../types"
/**
 * TimeSeriesDB handles operations for managing and querying time-series data
 * stored in a TimescaleDB database.
 */
export declare class TimeSeriesDB {
  private pool
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
  constructor(pool: Pool)
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
  batchInsert(data: ScrapedData[]): Promise<void>
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
  getLatestMetrics(limit?: number): Promise<import("pg").QueryResult<any>>
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
  getMetricsByTimeRange(
    metric: string,
    start: Date,
    end: Date,
    interval?: string
  ): Promise<import("pg").QueryResult<any>>
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
  setupCompression(chunk_interval?: string): Promise<void>
}
