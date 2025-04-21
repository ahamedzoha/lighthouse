import { activities } from "../activities/index"
import pkg from "pg"
const { Pool } = pkg
import dotenv from "dotenv"

// Load environment variables
dotenv.config()

/**
 * Tests the complete scraping pipeline.
 *
 * This script calls the scrapeActivity to obtain raw data, then validates that data
 * using validateActivity. If the "--test-db" flag is provided, it also tests inserting the
 * validated data into the database.
 *
 * @example
 * // To test scraping only:
 * // npm run test:scraper
 *
 * // To test scraping with DB insertion:
 * // npm run test:scraper:db
 */
async function testScrape() {
  try {
    // Test scraping activity.
    console.log("Testing scrape activity...")
    const rawData = await activities.scrapeActivity()
    console.log(`Scraped ${rawData.length} records`)

    // Test validation activity.
    console.log("Validating scraped data...")
    const validatedData = await activities.validateActivity(rawData)
    console.log(`Validated ${validatedData.length} records`)

    // Test DB insertion (optional).
    if (process.argv.includes("--test-db")) {
      console.log("\nTesting database insertion...")
      await activities.insertDbActivity(validatedData)
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
