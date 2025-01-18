import { scrapeDSE } from "../lib/scrapers/dseScraper"
import { TimeSeriesDB } from "../lib/db"
import { Pool } from "pg"

const db = new TimeSeriesDB(new Pool())

export const activities = {
  async scrapeDSE() {
    const data = await scrapeDSE()
    await db.batchInsert(data)
    return data
  },
}

export type Activities = typeof activities
