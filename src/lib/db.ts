import { Pool } from "pg"
import { ScrapedData } from "../types"

export class TimeSeriesDB {
  constructor(private pool: Pool) {}

  async batchInsert(data: ScrapedData[]) {
    // Start a transaction for bulk insert
    const client = await this.pool.connect()
    try {
      await client.query("BEGIN")

      const query = {
        text: `
          INSERT INTO scraped_data(time, source, metric_name, value, metadata)
          SELECT * FROM UNNEST($1::timestamptz[], $2::varchar[], $3::varchar[], $4::float8[], $5::jsonb[])
        `,
        values: [
          data.map((v) => v.time),
          data.map((v) => v.source),
          data.map((v) => v.metric_name),
          data.map((v) => v.value),
          data.map((v) => v.metadata),
        ],
      }

      await client.query(query)
      await client.query("COMMIT")
    } catch (error) {
      await client.query("ROLLBACK")
      throw error
    } finally {
      client.release()
    }
  }

  // Optimized time-series queries
  async getLatestMetrics(limit = 10) {
    return this.pool.query(
      `
      SELECT DISTINCT ON (metric_name)
        time, source, metric_name, value, metadata
      FROM scraped_data
      ORDER BY metric_name, time DESC
      LIMIT $1
    `,
      [limit]
    )
  }

  async getMetricsByTimeRange(
    metric: string,
    start: Date,
    end: Date,
    interval = "1 hour"
  ) {
    return this.pool.query(
      `
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
    `,
      [interval, metric, start, end]
    )
  }

  // Add compression policy if needed
  async setupCompression(chunk_interval = "7 days") {
    await this.pool.query(`
      ALTER TABLE scraped_data SET (
        timescaledb.compress,
        timescaledb.compress_segmentby = 'metric_name,source'
      );
    `)

    await this.pool.query(`
      SELECT add_compression_policy('scraped_data', INTERVAL '${chunk_interval}');
    `)
  }
}
