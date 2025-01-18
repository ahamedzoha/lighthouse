// src/scripts/initDb.ts
import { Pool } from "pg"
import dotenv from "dotenv"

dotenv.config()

async function initializeDatabase() {
  // Connect as postgres user (default superuser)
  const adminPool = new Pool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "5432"),
    database: "postgres",
    user: "postgres",
    password: process.env.DB_PASSWORD,
  })

  try {
    // Create user if not exists - using string interpolation for DDL
    await adminPool.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = '${process.env.DB_USER}') THEN
          CREATE USER "${process.env.DB_USER}" WITH PASSWORD '${process.env.DB_PASSWORD}';
        END IF;
      END
      $$;
    `)

    // Check if database exists
    const dbExists = await adminPool.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [process.env.DB_NAME]
    )

    // Create database if it doesn't exist
    if (dbExists.rows.length === 0) {
      await adminPool.query(`CREATE DATABASE "${process.env.DB_NAME}"`)
      console.log(`Database ${process.env.DB_NAME} created`)
    }

    // Grant privileges
    await adminPool.query(`
      GRANT ALL PRIVILEGES ON DATABASE "${process.env.DB_NAME}" TO "${process.env.DB_USER}"
    `)

    console.log("User and database setup completed")
    await adminPool.end()

    // Connect to the new database to create tables
    const appPool = new Pool({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || "5432"),
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    })

    try {
      // Create extension if not exists
      await appPool.query("CREATE EXTENSION IF NOT EXISTS timescaledb CASCADE;")

      // Create the hypertable
      await appPool.query(`
        CREATE TABLE IF NOT EXISTS scraped_data (
            time        TIMESTAMPTZ NOT NULL,
            source      VARCHAR(255),
            metric_name VARCHAR(255),
            value       DOUBLE PRECISION,
            metadata    JSONB
        );
      `)

      // Convert to hypertable if not already
      await appPool.query(`
        SELECT create_hypertable('scraped_data', 'time', if_not_exists => TRUE);
      `)

      console.log("Database tables initialized successfully")
    } catch (error) {
      console.error("Error creating tables:", error)
      throw error
    } finally {
      await appPool.end()
    }
  } catch (error) {
    console.error("Error initializing database:", error)
    process.exit(1)
  }
}

initializeDatabase().catch(console.error)
