import { scrapeDSE } from "../lib/scrapers/dseScraper"
import { TimeSeriesDB } from "../lib/db"
import { Pool } from "pg"
import dotenv from "dotenv"

// Load environment variables
dotenv.config()

const db = new TimeSeriesDB(
  new Pool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "5432"),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  })
)

export const activities = {
  async scrapeDSE() {
    const data = await scrapeDSE()
    await db.batchInsert(data)
    return data
  },
}

export type Activities = typeof activities
