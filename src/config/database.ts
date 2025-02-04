import { Pool } from "pg"
import dotenv from "dotenv"

dotenv.config()

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
export const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "5432"),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
})

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
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    const client = await pool.connect()
    await client.query("SELECT NOW()")
    client.release()
    return true
  } catch (error) {
    console.error("Database connection failed:", error)
    return false
  }
}
