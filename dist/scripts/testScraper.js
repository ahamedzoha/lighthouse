"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../activities/index");
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
dotenv_1.default.config();
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
        console.log("Testing scrape activity...");
        const rawData = await index_1.activities.scrapeActivity();
        console.log(`Scraped ${rawData.length} records`);
        // Test validation activity.
        console.log("Validating scraped data...");
        const validatedData = await index_1.activities.validateActivity(rawData);
        console.log(`Validated ${validatedData.length} records`);
        // Test DB insertion (optional).
        if (process.argv.includes("--test-db")) {
            console.log("\nTesting database insertion...");
            await index_1.activities.insertDbActivity(validatedData);
            console.log("Successfully inserted into database");
        }
    }
    catch (error) {
        console.error("Test failed:", error instanceof Error ? error.message : error);
        process.exit(1);
    }
}
testScrape();
