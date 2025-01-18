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
│   │   ├── initDb.ts            # Database initialization
│   │   ├── testScraper.ts       # Scraper testing utility
│   │   └── scheduleDSEScraper.ts # DSE scraper scheduler
│   │   └── utils/
│   │       └── scrapeUtils.ts   # Scraper utility functions
│   ├── types.ts                  # TypeScript type definitions
│   └── workflows/
│       └── dseScraperWorkflow.ts # Temporal workflow definition
├── docs/
│   ├── technical/
│   │   ├── architecture.md       # System architecture
│   │   ├── database.md          # Database schema & queries
│   │   ├── deployment.md        # Deployment guide
│   │   ├── monitoring.md        # Monitoring setup
│   │   └── security.md          # Security practices
│   ├── guides/
│   │   ├── scraper.md           # Scraper development guide
│   │   ├── workflow.md          # Temporal workflow guide
│   │   └── testing.md           # Testing procedures
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
- Development guides
- API documentation
- Setup instructions

## Development Tools

### Scripts

- `npm run dev:worker` - Start Temporal worker
- `npm run dev:scheduler` - Start scheduler
- `npm run init:db` - Initialize database
- `npm run test:scraper` - Test scraper
- `npm run test:scraper:db` - Test scraper with DB

### Testing

- Jest for unit testing
- Scraper testing utilities
- Database integration tests

### Development

- ESLint for code linting
- TypeScript for type safety
- Nodemon for development reload
