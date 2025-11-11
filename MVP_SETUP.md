# MVP Setup Guide

This guide will help you set up and run the TrueHome MVP with sample data.

## Prerequisites

- Node.js 18+ installed
- Docker and Docker Compose installed
- npm or yarn package manager

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Docker Services

Start PostgreSQL, Redis, OpenSearch, and MinIO:

```bash
npm run docker:up
```

Wait a few moments for all services to be healthy. You can check with:

```bash
docker ps
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory (or copy from `.env.example` if it exists):

```bash
# Database
DATABASE_URL="postgresql://truehome:truehome@localhost:5432/truehome?schema=public"

# API
API_PORT=4000
FRONTEND_URL=http://localhost:3000

# Next.js
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### 4. Generate Prisma Client and Run Migrations

```bash
npm run db:generate
npm run db:migrate
```

### 5. Seed Sample Data

This will populate the database with 5 sample properties with rich history:

```bash
npm run db:seed
```

You should see output like:
```
🌱 Starting data seeding...
🧹 Clearing existing data...
📦 Ingesting property: 1234 Main Street
✅ Completed: 1234 Main Street
...
🎉 Data seeding completed successfully!
```

### 6. Start Development Servers

In separate terminals:

**Terminal 1 - API Server:**
```bash
cd apps/api
npm run dev
```

**Terminal 2 - Web Server:**
```bash
cd apps/web
npm run dev
```

### 7. Access the Application

- **Frontend**: http://localhost:3000
- **API**: http://localhost:4000
- **Prisma Studio** (optional): `npm run db:studio`

## Testing the MVP

1. **Search for Properties**: 
   - Go to http://localhost:3000
   - Try searching for: "Main Street", "Plano", "75023", or "123456789"

2. **View Property Details**:
   - Click on any search result
   - You'll see:
     - Property details (bedrooms, bathrooms, lot size, etc.)
     - Ownership history
     - Sales history
     - Building permits
     - Contractor work history
     - Rental signals (if any)
     - Insurance claims (if any)

3. **Sample Properties to Try**:
   - "1234 Main Street" - Plano property with extensive history
   - "5678 Oak Avenue" - Frisco property
   - "9012 Elm Drive" - McKinney property with multiple sales
   - "3456 Maple Court" - Allen property
   - "7890 Pine Street" - Richardson property

## Sample Data Overview

The seed script creates 5 properties across different cities in Collin County, TX:

- **Property 1**: 1234 Main Street, Plano
  - 3 sales (2010, 2018, 2023)
  - 3 permits (roofing, electrical, kitchen renovation)
  - 2 work events (HVAC, plumbing)
  - Rental history
  - Insurance claim

- **Property 2**: 5678 Oak Avenue, Frisco
  - 2 sales (2019, 2024)
  - 2 permits (deck addition, EV charging)
  - 1 work event (landscaping)

- **Property 3**: 9012 Elm Drive, McKinney
  - 3 sales (2005, 2015, 2022)
  - 3 permits (plumbing, bathroom, roofing)
  - 2 work events (roofing, HVAC)
  - Rental history
  - 2 insurance claims

- **Property 4**: 3456 Maple Court, Allen
  - 2 sales (2017, 2023)
  - 1 permit (garage conversion)

- **Property 5**: 7890 Pine Street, Richardson
  - 2 sales (2013, 2021)
  - 2 permits (electrical, building addition)
  - 2 work events (electrical, plumbing)
  - 1 insurance claim

## Troubleshooting

### Database Connection Issues

If you get connection errors:
1. Make sure Docker is running: `docker ps`
2. Check if PostgreSQL is healthy: `docker logs truehome-postgres`
3. Verify DATABASE_URL in your `.env` file

### Prisma Client Not Found

If you see "PrismaClient is not defined":
```bash
cd packages/db
npm install
npm run generate
```

### Port Already in Use

If ports 3000 or 4000 are in use:
- Change `API_PORT` in `.env` for the API
- Change the port in `apps/web/package.json` dev script for the web app

### Seed Script Errors

If the seed script fails:
1. Make sure migrations have run: `npm run db:migrate`
2. Check that Prisma client is generated: `npm run db:generate`
3. Verify Docker services are running

## Next Steps

Once the MVP is running, you can:

1. **Explore the Data**: Use Prisma Studio to browse the database
2. **Test Search**: Try different search queries
3. **View Reports**: Click through property detail pages
4. **Extend Data**: Add more properties via the ingestion API
5. **Enhance UI**: Customize the frontend components

## API Endpoints

- `GET /search?q=<query>` - Search properties
- `GET /properties/:id` - Get property details
- `GET /properties/:id/history` - Get property timeline
- `GET /properties/:id/sales` - Get sales history
- `GET /properties/:id/permits` - Get permits
- `POST /ingestion/property` - Ingest new property
- `POST /ingestion/sale` - Ingest sale record
- `POST /ingestion/permit` - Ingest permit
- `POST /ingestion/ownership` - Ingest ownership event

## Stopping Services

To stop all Docker services:
```bash
npm run docker:down
```

To stop development servers, press `Ctrl+C` in each terminal.

