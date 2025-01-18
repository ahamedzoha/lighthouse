import { Pool } from "pg"
import { ScrapedData } from "../types"

export class TimeSeriesDB {
  constructor(private pool: Pool) {}

  async batchInsert(data: ScrapedData[]) {
    // Validate data
    if (!data?.length) {
      throw new Error("No data to insert")
    }

    // Validate each record
    data.forEach((record) => {
      if (
        !record.time ||
        !record.metric_name ||
        typeof record.value !== "number"
      ) {
        throw new Error(`Invalid record: ${JSON.stringify(record)}`)
      }
    })

    const values = data.map((d) => ({
      time: d.time,
      source: d.source,
      metric_name: d.metric_name,
      value: d.value,
      metadata: JSON.stringify(d.metadata),
    }))

    // Using pg's built-in parameterized queries
    const query = {
      text: `
        INSERT INTO scraped_data(time, source, metric_name, value, metadata)
        SELECT * FROM UNNEST($1::timestamptz[], $2::varchar[], $3::varchar[], $4::float8[], $5::jsonb[])
      `,
      values: [
        values.map((v) => v.time),
        values.map((v) => v.source),
        values.map((v) => v.metric_name),
        values.map((v) => v.value),
        values.map((v) => v.metadata),
      ],
    }

    return this.pool.query(query)
  }

  // Add methods for common time-series queries
  async getMetricsByTimeRange(metric: string, start: Date, end: Date) {
    return this.pool.query(
      `
      SELECT time_bucket('1 hour', time) AS hour,
             avg(value) as avg_value,
             max(value) as max_value,
             min(value) as min_value
      FROM scraped_data 
      WHERE metric_name = $1 
        AND time BETWEEN $2 AND $3
      GROUP BY hour
      ORDER BY hour DESC
    `,
      [metric, start, end]
    )
  }
}
