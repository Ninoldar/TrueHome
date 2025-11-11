# TrueHome Setup Guide

## Prerequisites

- Node.js 18+ installed
- Docker and Docker Compose installed
- npm or yarn package manager

## Initial Setup

1. **Install dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

2. **Set up environment variables:**
   \`\`\`bash
   cp .env.example .env
   # Edit .env with your configuration if needed
   \`\`\`

3. **Start Docker services:**
   \`\`\`bash
   npm run docker:up
   \`\`\`
   
   This starts:
   - PostgreSQL with PostGIS (port 5432)
   - Redis (port 6379)
   - OpenSearch (port 9200)
   - MinIO S3-compatible storage (ports 9000, 9001)

4. **Wait for services to be healthy** (about 30-60 seconds)

5. **Generate Prisma client:**
   \`\`\`bash
   npm run db:generate
   \`\`\`

6. **Run database migrations:**
   \`\`\`bash
   npm run db:migrate
   \`\`\`

7. **Start development servers:**
   \`\`\`bash
   npm run dev
   \`\`\`

   This will start:
   - Frontend: http://localhost:3000
   - API: http://localhost:4000

## Verify Setup

1. Check API health:
   \`\`\`bash
   curl http://localhost:4000/health
   \`\`\`

2. Open Prisma Studio to view database:
   \`\`\`bash
   npm run db:studio
   \`\`\`

3. Visit http://localhost:3000 in your browser

## Adding Sample Data

You can add sample property data via the ingestion API:

\`\`\`bash
curl -X POST http://localhost:4000/ingestion/property \
  -H "Content-Type: application/json" \
  -d '{
    "property": {
      "address": "123 Main Street",
      "city": "Plano",
      "state": "TX",
      "zipCode": "75023",
      "apn": "123456789",
      "lotSize": 8000,
      "livingArea": 2500,
      "bedrooms": 4,
      "bathrooms": 2.5,
      "yearBuilt": 2010,
      "propertyType": "Single Family"
    },
    "source": "manual",
    "sourceId": "test_001"
  }'
\`\`\`

Then search for "123 Main" on the frontend to see it appear.

## Troubleshooting

### Docker services won't start
- Make sure Docker is running
- Check if ports 5432, 6379, 9200, 9000 are already in use
- Try: `docker-compose down` then `docker-compose up -d`

### Database connection errors
- Wait a bit longer for PostgreSQL to fully start
- Check DATABASE_URL in .env matches docker-compose.yml settings
- Verify PostgreSQL is running: `docker ps`

### Prisma errors
- Make sure you ran `npm run db:generate` first
- Try deleting `node_modules` and reinstalling: `rm -rf node_modules && npm install`

## Next Steps

1. Research Collin County data sources (see INGESTION.md)
2. Implement actual data ingestion from Collin CAD
3. Add authentication (Clerk/Auth0)
4. Add payment processing (Stripe)
5. Deploy to production
