"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activities = void 0;
const dseScraper_1 = require("../lib/scrapers/dseScraper");
const db_1 = require("../lib/db");
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = require("zod");
// Load environment variables
dotenv_1.default.config();
const db = new db_1.TimeSeriesDB(new pg_1.Pool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "5432"),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
}));
// Define Zod schemas for metadata & the overall scraped data.
const metadataSchema = zod_1.z.object({
    high: zod_1.z.number(),
    low: zod_1.z.number(),
    close_price: zod_1.z.number(),
    ycp: zod_1.z.number(),
    change: zod_1.z.number(),
    trade_count: zod_1.z.number(),
    value_mn: zod_1.z.number(),
    volume: zod_1.z.number(),
});
const ScrapedDataSchema = zod_1.z.object({
    time: zod_1.z
        .union([zod_1.z.string(), zod_1.z.date()])
        .transform((val) => (val instanceof Date ? val : new Date(val))),
    source: zod_1.z.string(),
    metric_name: zod_1.z.string(),
    value: zod_1.z.number(),
    metadata: metadataSchema,
});
const ScrapedDataArraySchema = zod_1.z.array(ScrapedDataSchema);
exports.activities = {
    /**
     * Activity to perform the scraping.
     *
     * @returns {Promise<ScrapedData[]>} The raw scraped data.
     *
     * @example
     * const rawData = await activities.scrapeActivity();
     */
    scrapeActivity: async () => {
        return await (0, dseScraper_1.scrapeDSE)();
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
