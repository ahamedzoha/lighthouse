// src/scripts/initDb.ts
import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config();
/**
 * Initializes the application database.
 *
 * This script checks if the user and database exist, creates them if necessary,
 * grants the required privileges, and initializes the tables (including creating a hypertable).
 *
 * @example
 * // To initialize the database:
 * // npm run init:db
 */
async function initializeDatabase() {
    // Connect as postgres user (default superuser)
    const adminPool = new Pool({
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || "5432"),
        database: "postgres",
        user: "postgres",
        password: process.env.DB_PASSWORD,
    });
    try {
        // Create user if not exists
        await adminPool.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = '${process.env.DB_USER}') THEN
          CREATE USER "${process.env.DB_USER}" WITH PASSWORD '${process.env.DB_PASSWORD}';
        END IF;
      END
      $$;
    `);
        // Check if database exists
        const dbExists = await adminPool.query("SELECT 1 FROM pg_database WHERE datname = $1", [process.env.DB_NAME]);
        // Create database if it doesn't exist
        if (dbExists.rows.length === 0) {
            await adminPool.query(`CREATE DATABASE "${process.env.DB_NAME}"`);
            console.log(`Database ${process.env.DB_NAME} created`);
        }
        // Grant privileges
        await adminPool.query(`
      GRANT ALL PRIVILEGES ON DATABASE "${process.env.DB_NAME}" TO "${process.env.DB_USER}"
    `);
        console.log("User and database setup completed");
        await adminPool.end();
        // Connect to the new database to create tables
        const appPool = new Pool({
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT || "5432"),
            database: process.env.DB_NAME,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
        });
        try {
            // Create extension if not exists
            await appPool.query("CREATE EXTENSION IF NOT EXISTS timescaledb CASCADE;");
            // Create the hypertable
            await appPool.query(`
        CREATE TABLE IF NOT EXISTS scraped_data (
            time        TIMESTAMPTZ NOT NULL,
            source      VARCHAR(255),
            metric_name VARCHAR(255),
            value       DOUBLE PRECISION,
            metadata    JSONB
        );
      `);
            // Convert to hypertable if not already
            await appPool.query(`
        SELECT create_hypertable('scraped_data', 'time', if_not_exists => TRUE);
      `);
            console.log("Database tables initialized successfully");
        }
        catch (error) {
            console.error("Error creating tables:", error);
            throw error;
        }
        finally {
            await appPool.end();
        }
    }
    catch (error) {
        console.error("Error initializing database:", error);
        process.exit(1);
    }
}
/**
 * Applies optimizations to the Time-Series database.
 *
 * This includes enabling TimescaleDB compression, adding a compression policy,
 * and creating indexes for faster queries.
 *
 * @example
 * await optimizeTimeSeriesDB();
 */
async function optimizeTimeSeriesDB() {
    const pool = new Pool({
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || "5432"),
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
    });
    try {
        // Enable compression
        await pool.query(`
      ALTER TABLE scraped_data SET (
        timescaledb.compress,
        timescaledb.compress_segmentby = 'metric_name,source'
      );
    `);
        // Add compression policy (compress data older than 7 days)
        await pool.query(`
      SELECT add_compression_policy('scraped_data', INTERVAL '7 days');
    `);
        // Create indexes for better query performance
        await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_scraped_data_metric_time 
      ON scraped_data (metric_name, time DESC);
      
      CREATE INDEX IF NOT EXISTS idx_scraped_data_source_time 
      ON scraped_data (source, time DESC);
    `);
        console.log("TimescaleDB optimizations applied successfully");
    }
    catch (error) {
        console.error("Failed to apply optimizations:", error);
    }
    finally {
        await pool.end();
    }
}
initializeDatabase()
    .then(async () => {
    await optimizeTimeSeriesDB();
})
    .catch(console.error);
