# Lighthouse System Overview

## Infrastructure
- INFRA:docker|timescaledb|temporal|temporal-ui
- STACK:node18|ts|puppeteer|pg|temporal-sdk
- DB:timescaledb{time-series,hypertables}
- SCHEMA:scraped_data{time,source,metric,value,metadata}

## System Components

### Worker
- Executes scraping workflows
- Retrieves data from web sources
- Validates data using Zod schemas
- Stores data in TimescaleDB
- Handles retries and error reporting

### Scheduler
- Connects to Temporal service
- Creates and manages schedules
- Configures cron expressions for trading hours
- Triggers workflows at specified intervals

### Database (TimescaleDB)
- Time-series optimized PostgreSQL extension
- Handles high-volume inserts efficiently
- Supports data compression and retention policies
- Optimized for time-range queries
- Hypertable-based architecture

### Temporal
- Workflow orchestration and scheduling
- Reliable execution with persistence
- Automatic retry mechanisms
- Task queue management
- Workflow history and visibility

## Data Flows
- schedule>workflow>scrape>store
- error>retry>alert>log

## Configuration
- DB_ENV:host,port,name,user,pwd
- TEMPORAL_ENV:address,namespace
- DOCKER:network,volumes,healthchecks

## Security Measures
- Environment variable-based secrets
- Isolated Docker network
- Least privilege access principles
- Encrypted data storage

## Monitoring
- Temporal UI for workflow visibility
- Database health monitoring
- Scraping metrics collection
- Error rate tracking

## Scaling Considerations
- Parallel scraping workers
- Database connection pooling
- Rate limiting for external APIs
- Configurable retry policies

---

This project implements a containerized web scraping system using:

- **TimescaleDB** for time-series data storage
- **Temporal.io** for workflow orchestration
- **Puppeteer** for web scraping
- **TypeScript/Node.js** for implementation
- **Docker** for containerization and deployment
