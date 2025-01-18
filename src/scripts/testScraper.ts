import { scrapeDSE } from "../lib/scrapers/dseScraper"
import { TimeSeriesDB } from "../lib/db"
import { Pool } from "pg"
import dotenv from "dotenv"

// Load environment variables
dotenv.config()

async function testScrape() {
  try {
    // Test scraping
    console.log("Testing DSE scraper...")
    const data = await scrapeDSE()
    console.log(`Scraped ${data.length} records`)
    console.log("Sample record:", JSON.stringify(data[0], null, 2))

    // Test DB insertion (optional)
    const shouldTestDB = process.argv.includes("--test-db")
    if (shouldTestDB) {
      console.log("\nTesting database insertion...")
      const db = new TimeSeriesDB(
        new Pool({
          host: process.env.DB_HOST,
          port: parseInt(process.env.DB_PORT || "5432"),
          database: process.env.DB_NAME,
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
        })
      )
      await db.batchInsert(data)
      console.log("Successfully inserted into database")
    }
  } catch (error: unknown) {
    console.error(
      "Test failed:",
      error instanceof Error ? error.message : error
    )
    process.exit(1)
  }
}

testScrape()
