# Lighthouse - Stock Market Data Scraper

A system for scraping and storing stock market data from DSE (Dhaka Stock Exchange).

## Quick Start

1. Setup environment:

```bash
# Copy and configure environment variables
cp .env.example .env

# Install dependencies
npm install
```

2. Initialize database:

```bash
npm run init:db
```

3. Test scraper:

```bash
# Test scraping only
npm run test:scraper

# Test scraping with database insertion
npm run test:scraper:db
```

## Development Environment

Start the complete environment using Docker Compose:

```bash
# Start all services (TimescaleDB, Temporal, Worker, Scheduler)
docker-compose up -d

# View logs
docker-compose logs -f worker scheduler
```

Individual development commands:

```bash
# Start Temporal worker in development mode
npm run dev:worker

# Start scheduler in development mode
npm run dev:scheduler
```

## Architecture

Lighthouse is built on the following components:

- **TimescaleDB**: Time-series database for storing scraped market data
- **Temporal.io**: Workflow orchestration for reliable scheduling and execution
- **Node.js/TypeScript**: Implementation language
- **Puppeteer**: Web scraping library

The system consists of these main components:

1. **Worker**: Executes scraping workflows and stores data
2. **Scheduler**: Creates and manages temporal schedules
3. **Database**: TimescaleDB for efficient time-series storage
4. **Temporal**: Handles workflow orchestration and retries

## Adding New Data Sources

1. Create scraper in `src/lib/scrapers/`:

```typescript
export async function scrapeNewSource(): Promise<ScrapedData[]> {
  // Implement scraping logic
  return [
    {
      time: new Date(),
      source: "source_name",
      metric_name: "metric",
      value: 123.45,
      metadata: {
        /* additional data */
      },
    },
  ]
}
```

2. Test your scraper:

```bash
# Create test script
npm run test:scraper:newsource
```

## Production Deployment

Deploy using Docker Compose:

```bash
# Production deployment
docker-compose -f docker-compose.yml -f docker-compose.worker.yml up -d
```

## Environment Variables

Key environment variables:

- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`: Database connection
- `TEMPORAL_ADDRESS`: Temporal server address
- Worker-specific versions of the above (with `WORKER_` prefix)

For details see [.env.example](./.env.example).

## Technical Details

See [Technical Documentation](./docs/TECHNICAL_README.md) for:

- System architecture
- Database schema
- API documentation
- Deployment guide
- Troubleshooting

## License

ISC License - See LICENSE file for details
