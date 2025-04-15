import { Pool } from "pg";
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
export declare const pool: Pool;
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
export declare function checkDatabaseConnection(): Promise<boolean>;
