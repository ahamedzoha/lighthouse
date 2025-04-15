import { scrapeDSE } from "../lib/scrapers/dseScraper.js";
import { TimeSeriesDB } from "../lib/db.js";
import pg from "pg";
import dotenv from "dotenv";
import { z } from "zod";
// Load environment variables
dotenv.config();
const { Pool } = pg;
const db = new TimeSeriesDB(new Pool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "5432"),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
}));
// Define Zod schemas for metadata & the overall scraped data.
const metadataSchema = z.object({
    high: z.number(),
    low: z.number(),
    close_price: z.number(),
    ycp: z.number(),
    change: z.number(),
    trade_count: z.number(),
    value_mn: z.number(),
    volume: z.number(),
});
const ScrapedDataSchema = z.object({
    time: z
        .union([z.string(), z.date()])
        .transform((val) => (val instanceof Date ? val : new Date(val))),
    source: z.string(),
    metric_name: z.string(),
    value: z.number(),
    metadata: metadataSchema,
});
const ScrapedDataArraySchema = z.array(ScrapedDataSchema);
export const activities = {
    /**
     * Activity to perform the scraping.
     *
     * @returns {Promise<ScrapedData[]>} The raw scraped data.
     *
     * @example
     * const rawData = await activities.scrapeActivity();
     */
    scrapeActivity: async () => {
        return await scrapeDSE();
    },
    /**
     * Activity to validate the raw scraped data using Zod.
     *
     * @param {unknown[]} data - The raw scraped data.
     * @returns {ScrapedData[]} The validated scraped data.
     *
     * @throws {Error} If validation fails.
     *
     * @example
     * const validatedData = await activities.validateActivity(rawData);
     */
    validateActivity: async (data) => {
        const result = ScrapedDataArraySchema.safeParse(data);
        if (!result.success) {
            throw new Error("Validation failed: " + JSON.stringify(result.error.issues));
        }
        return result.data;
    },
    /**
     * Activity to insert validated data into the database.
     *
     * @param {ScrapedData[]} data - The validated scraped data.
     * @returns {Promise<void>}
     *
     * @example
     * await activities.insertDbActivity(validatedData);
     */
    insertDbActivity: async (data) => {
        await db.batchInsert(data);
    },
};
