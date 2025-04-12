"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
/**
 * Verifies the state of the TimescaleDB time-series database.
 *
 * This script queries the hypertable status, recent data samples, and compression settings,
 * printing the results to the console.
 *
 * @example
 * // To verify the database:
 * // npm run verify:db
 */
async function verifyData() {
    const pool = new pg_1.Pool({
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || "5432"),
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
    });
    try {
        // Check hypertable status
        const hypertableInfo = await pool.query(`
      SELECT * FROM timescaledb_information.hypertables 
      WHERE hypertable_name = 'scraped_data';
    `);
        console.log("\nHypertable Info:", hypertableInfo.rows);
        // Check recent data
        const recentData = await pool.query(`
      SELECT time_bucket('1 minute', time) AS minute,
             count(*) as records,
             avg(value) as avg_value
      FROM scraped_data
      WHERE time > NOW() - INTERVAL '1 hour'
      GROUP BY minute
      ORDER BY minute DESC
      LIMIT 5;
    `);
        console.log("\nRecent Data Samples:", recentData.rows);
        // Check compression status
        const compressionInfo = await pool.query(`
      SELECT * FROM timescaledb_information.compression_settings
      WHERE hypertable_name = 'scraped_data';
    `);
        console.log("\nCompression Settings:", compressionInfo.rows);
    }
    catch (error) {
        console.error("Verification failed:", error);
    }
    finally {
        await pool.end();
    }
}
verifyData().catch(console.error);
