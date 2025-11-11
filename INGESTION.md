# Data Ingestion Guide

This document outlines how to ingest property data into TrueHome.

## Data Sources

### Collin County, Texas

1. **Collin Central Appraisal District (CAD)**
   - Primary source for property records, APNs, assessed values
   - May provide API, CSV exports, or require web scraping
   - Location: https://www.collincad.org/

2. **County Clerk/Recorder**
   - Deeds, ownership transfers, liens
   - May require document parsing or manual entry
   - Location: https://www.collincountytx.gov/clerk/

3. **City Permit Portals**
   - Building permits, inspections
   - Cities: Plano, Frisco, McKinney, Allen, Richardson, etc.
   - Each city may have different portal structure

## Ingestion Methods

### 1. API Ingestion

Use the ingestion API endpoints:

```bash
# Ingest a property
curl -X POST http://localhost:4000/ingestion/property \
  -H "Content-Type: application/json" \
  -d '{
    "property": {
      "apn": "123456789",
      "address": "123 Main St",
      "city": "Plano",
      "state": "TX",
      "zipCode": "75023",
      "lotSize": 8000,
      "livingArea": 2500,
      "bedrooms": 4,
      "bathrooms": 2.5,
      "yearBuilt": 2010
    },
    "source": "collin_cad",
    "sourceId": "cad_123456789"
  }'

# Ingest a sale
curl -X POST http://localhost:4000/ingestion/sale \
  -H "Content-Type: application/json" \
  -d '{
    "propertyId": "property_id_here",
    "data": {
      "saleDate": "2023-01-15",
      "salePrice": 450000,
      "buyerName": "John Doe",
      "sellerName": "Jane Smith"
    },
    "source": "county_records"
  }'

# Ingest a permit
curl -X POST http://localhost:4000/ingestion/permit \
  -H "Content-Type: application/json" \
  -d '{
    "propertyId": "property_id_here",
    "data": {
      "permitNumber": "PER-2023-001",
      "permitType": "Building",
      "status": "Issued",
      "issuedDate": "2023-06-01",
      "jurisdiction": "Plano"
    },
    "source": "plano_permits"
  }'
```

### 2. Batch Ingestion Scripts

Create scripts in `apps/api/src/ingestion/scripts/` for batch processing:

```typescript
// Example: scripts/ingest-collin-cad.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { CollinCadIngester } from '../sources/collin-cad.ingester';

async function main() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const ingester = app.get(CollinCadIngester);
  
  // Your ingestion logic here
  await ingester.ingestFromFile('./data/collin-cad-export.csv');
  
  await app.close();
}

main();
```

### 3. Scheduled Jobs

Use NestJS schedulers or external job queues (BullMQ) for periodic ingestion:

```typescript
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class ScheduledIngestion {
  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async ingestDailyUpdates() {
    // Fetch and ingest new data
  }
}
```

## Data Quality

- Always record source and sourceId for traceability
- Store raw payloads in SourceRecord for debugging
- Handle duplicates (check by APN or address)
- Validate data before ingestion
- Update existing records rather than creating duplicates

## Next Steps

1. Research Collin CAD API/export formats
2. Implement actual data fetching logic
3. Set up scheduled ingestion jobs
4. Add data validation and error handling
5. Monitor ingestion success/failure rates

