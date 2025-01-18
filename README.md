# Web Scraping Project Knowledge Base

## Project Overview

### Purpose

This project implements a robust web scraping system designed to collect time-series data from various sources. The system is containerized, scalable, and uses modern technologies for reliability and maintainability.

### Core Technologies

#### Backend Stack

- **Node.js** - Runtime environment
- **TypeScript** - Programming language for type safety
- **Puppeteer** - Headless browser automation
- **TimescaleDB** - Time-series database (PostgreSQL extension)
- **Temporal.io** - Workflow orchestration and job scheduling
- **Docker** - Containerization

### System Architecture

#### Components

1. **Scraper Service**

   - Runs in Docker container
   - Executes scraping workflows
   - Handles browser automation
   - Manages data extraction and storage

2. **Database Layer**

   - TimescaleDB for time-series data storage
   - Optimized for time-based queries
   - Handles data compression and retention

3. **Workflow Engine**

   - Temporal.io server
   - Manages job scheduling
   - Handles retries and error recovery
   - Provides workflow history and visibility

4. **Infrastructure**
   - Docker Compose for local development
   - Container networking
   - Volume management for persistence
   - Environment-based configuration

## Technical Details

### Database Schema

```sql
CREATE TABLE scraped_data (
    time        TIMESTAMPTZ NOT NULL,
    source      VARCHAR(255),
    metric_name VARCHAR(255),
    value       DOUBLE PRECISION,
    metadata    JSONB
);

-- Convert to hypertable
SELECT create_hypertable('scraped_data', 'time');
```

### Key Configuration Parameters

#### TimescaleDB

- Database Name: scraper_db
- Default Port: 5432
- Chunk Time Interval: 7 days
- Retention Policy: Configurable

#### Temporal

- Server Port: 7233
- Task Queue: 'scraper'
- Workflow Timeout: 10 minutes
- Activity Retry Policy:
  - Maximum Attempts: 3
  - Initial Interval: 10 seconds

#### Puppeteer

- Headless Mode: Enabled
- Default Timeout: 30000ms
- Resource Types: JS, CSS, Images enabled
- User Agent: Configurable per scraper

### Best Practices

#### Error Handling

1. **Database Errors**

   - Use connection pooling
   - Implement exponential backoff
   - Handle connection timeouts
   - Log failed transactions

2. **Scraping Errors**

   - Handle network timeouts
   - Manage DOM element waiting
   - Process rate limiting responses
   - Log failed scraping attempts

3. **Workflow Errors**
   - Use Temporal retry policies
   - Implement compensation logic
   - Handle workflow timeouts
   - Monitor failed workflows

#### Rate Limiting

1. **Implementation**

   - Use token bucket algorithm
   - Configure per-domain limits
   - Respect robots.txt
   - Handle 429 responses

2. **Parameters**
   - Default rate: 1 request/second
   - Burst size: 5 requests
   - Cooldown period: 60 seconds
   - Adjustable per target

### Monitoring and Observability

#### Metrics to Track

1. **Scraping Metrics**

   - Success/failure rates
   - Response times
   - Data volume
   - Error distribution

2. **System Metrics**

   - CPU usage
   - Memory consumption
   - Network utilization
   - Disk space

3. **Database Metrics**
   - Query performance
   - Connection pool status
   - Chunk compression ratio
   - Write throughput

### Security Considerations

#### Data Protection

1. **Storage**

   - Encrypt sensitive data
   - Use secure connections
   - Implement access controls
   - Regular backups

2. **Authentication**
   - Use environment variables
   - Rotate credentials
   - Implement least privilege
   - Audit access logs

#### Network Security

1. **Container Security**
   - Isolated network
   - Port exposure control
   - Regular updates
   - Security scanning

### Development Workflow

#### Local Setup

1. Clone repository
2. Copy `.env.example` to `.env`
3. Configure environment variables
4. Run `docker-compose up`

#### Adding New Scrapers

1. Create new activity in `activities/`
2. Define workflow in `workflows/`
3. Add scheduling configuration
4. Update documentation

#### Testing

1. **Unit Tests**

   - Activity functions
   - Data processing
   - Validation logic

2. **Integration Tests**
   - Workflow execution
   - Database operations
   - API endpoints

### Deployment Guidelines

#### Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- 4GB RAM minimum
- 20GB storage minimum

#### Environment Variables

```
DB_HOST=timescaledb
DB_PORT=5432
DB_NAME=scraper_db
DB_USER=scraper_user
DB_PASSWORD=<secret>
TEMPORAL_ADDRESS=temporal:7233
```

#### Maintenance Tasks

1. **Regular**

   - Log rotation
   - Data cleanup
   - Performance monitoring
   - Security updates

2. **Periodic**
   - Database optimization
   - Index maintenance
   - Backup verification
   - Configuration review

### Troubleshooting

#### Common Issues

1. **Connection Failures**

   - Check network configuration
   - Verify credentials
   - Inspect container logs
   - Confirm service health

2. **Performance Problems**
   - Monitor resource usage
   - Check rate limiting
   - Analyze query performance
   - Review workflow history

#### Debug Tools

- Docker logs
- Temporal Web UI
- pgAdmin or psql
- Chrome DevTools Protocol

## Future Enhancements

### Planned Features

1. **Performance**

   - Parallel scraping
   - Batch processing
   - Data compression
   - Cache implementation

2. **Functionality**

   - API endpoints
   - Dashboard UI
   - Export capabilities
   - Alert system

3. **Infrastructure**
   - Kubernetes support
   - Cloud deployment
   - Auto-scaling
   - HA setup

### Maintenance Notes

- Document all configuration changes
- Keep dependency list updated
- Maintain changelog
- Regular security audits
