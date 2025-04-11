# Project Structure

```
.
├── src/
│   ├── activities/
│   │   └── index.ts              # Temporal activities definitions
│   ├── config/
│   │   ├── database.ts           # Database configuration
│   │   └── temporal.ts           # Temporal client configuration
│   ├── lib/
│   │   ├── scrapers/
│   │   │   └── dseScraper.ts     # DSE market scraper implementation
│   │   └── db.ts                 # Database operations class
│   ├── scripts/
│   │   ├── initDb.ts             # Database initialization
│   │   ├── testScraper.ts        # Scraper testing utility
│   │   ├── scheduleDSEScraper.ts # DSE scraper scheduler
│   │   ├── triggerWorkflow.ts    # Workflow triggering utility
│   │   ├── verifyTimeSeriesData.ts # Data verification script
│   │   └── queries/
│   │       └── verify_hypertable.sql # Hypertable verification query
│   ├── types.ts                  # TypeScript type definitions
│   ├── scheduler.ts              # Scheduler implementation
│   ├── worker.ts                 # Worker implementation
│   └── workflows/
│       └── dseScraperWorkflow.ts # Temporal workflow definition
├── docs/
│   ├── llm-context.md           # System overview
│   ├── structure.md             # This file
│   └── TECHNICAL_README.md      # Technical documentation
├── temporal-config/
│   └── development.yaml         # Temporal development config
├── docker-compose.yml           # Container orchestration
├── .env.example                 # Environment variables template
├── .gitignore                   # Git ignore rules
├── package.json                 # Project dependencies & scripts
├── tsconfig.json               # TypeScript configuration
└── README.md                   # Project overview
```

## Key Components

### Infrastructure
- TimescaleDB for time-series data storage
- Temporal.io for workflow orchestration
- Docker & Docker Compose for containerization

### Source Code
- TypeScript/Node.js implementation
- Puppeteer for web scraping
- Temporal SDK for workflows
- pg (node-postgres) for database operations

### Configuration
- Environment-based configuration
- Temporal development settings
- TypeScript compiler options
- Docker service definitions

### Documentation
- Technical architecture docs
- System structure documentation
- Setup instructions

## Development Tools

### Scripts
- `npm run dev:worker` - Start Temporal worker
- `npm run dev:scheduler` - Start scheduler
- `npm run init:db` - Initialize database
- `npm run test:scraper` - Test scraper
- `npm run test:scraper:db` - Test scraper with DB

### Planned Improvements
- Add testing framework (Jest)
- Implement monitoring (Grafana)
- Add API documentation
