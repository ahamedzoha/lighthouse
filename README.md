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

## Development

- `npm run dev:worker` - Start Temporal worker
- `npm run dev:scheduler` - Start scheduler

## Technical Details

See [Technical Documentation](./docs/TECHNICAL_README.md) for:

- System architecture
- Database schema
- API documentation
- Deployment guide
- Troubleshooting

## License

ISC License - See LICENSE file for details
