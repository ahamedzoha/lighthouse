"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
exports.checkDatabaseConnection = checkDatabaseConnection;
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
/**
 * Creates a PostgreSQL connection pool configured for the TimescaleDB database.
 *
 * Environment variables are expected to define the DB connection parameters.
 *
 * @example
 * // Usage:
 * import { pool } from "./config/database";
 * pool.query("SELECT NOW()", (err, res) => console.log(res));
 */
exports.pool = new pg_1.Pool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "5432"),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});
/**
 * Checks whether the database connection is working.
 *
 * Executes a simple query and returns true if successful, false otherwise.
 *
 * @returns {Promise<boolean>} True if the connection is healthy, false otherwise.
 *
 * @example
 * const healthy = await checkDatabaseConnection();
 * if (!healthy) {
 *   console.error("Database connection failed");
 * }
 */
async function checkDatabaseConnection() {
    try {
        const client = await exports.pool.connect();
        await client.query("SELECT NOW()");
        client.release();
        return true;
    }
    catch (error) {
        console.error("Database connection failed:", error);
        return false;
    }
}
