# TrueHome - Carfax for Homes

A comprehensive platform for realtors and buyers to purchase detailed property history reports. Get complete insights into a property's sales history, work records, insurance claims, warranties, and AI-powered recommendations.

## Features

- 🔍 **Property Search** - Search properties by address, city, and state
- 📊 **Complete History** - View all sales, work records, insurance claims, and warranties
- 🤖 **Smart Recommendations** - AI-powered insights based on property history
- 🛡️ **Warranty Tracking** - Track active warranties and expiration dates
- 💳 **Report Generation** - Generate comprehensive property reports for purchase
- 📱 **Modern UI** - Beautiful, responsive interface built with Next.js and Tailwind CSS

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: SQLite (development) / PostgreSQL (production)
- **ORM**: Prisma
- **Styling**: Tailwind CSS
- **Validation**: Zod

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up the database:
```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database (creates SQLite database)
npm run db:push

# Seed database with sample properties
npm run db:seed
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Database Management

- View database in Prisma Studio:
```bash
npm run db:studio
```

- Reset database (if needed):
```bash
# Delete prisma/dev.db and run:
npm run db:push
```

## Project Structure

```
truehome/
├── app/
│   ├── api/              # API routes
│   │   ├── properties/   # Property search and CRUD
│   │   ├── reports/      # Report generation
│   │   ├── purchases/    # Purchase management
│   │   └── data/         # Data entry (sales, work, claims, warranties)
│   ├── property/[id]/    # Property detail page
│   ├── report/[reportId]/ # Report viewing page
│   └── page.tsx          # Home page with search
├── lib/
│   ├── db.ts             # Prisma client
│   ├── types.ts          # TypeScript types
│   └── report-generator.ts # Report generation logic
├── prisma/
│   └── schema.prisma     # Database schema
└── ...
```

## API Endpoints

### Properties
- `GET /api/properties/search` - Search for a property
- `GET /api/properties/[id]` - Get property details
- `POST /api/properties/create` - Create a new property

### Reports
- `POST /api/reports/generate` - Generate a property report
- `GET /api/reports/[reportId]` - Get report details

### Purchases
- `POST /api/purchases/create` - Create a purchase record

### Data Entry
- `POST /api/data/sale` - Add sale record
- `POST /api/data/work` - Add work record
- `POST /api/data/claim` - Add insurance claim
- `POST /api/data/warranty` - Add warranty

## Database Schema

The platform tracks:
- **Properties** - Basic property information
- **Sales** - Sales history with dates, prices, buyers/sellers
- **Work Records** - Work performed, contractors, permits, warranties
- **Insurance Claims** - Claim history and amounts
- **Warranties** - Active and expired warranties
- **Reports** - Generated reports
- **Purchases** - Report purchase transactions
- **Users** - Buyers, realtors, and admins

## Report Features

Reports include:
- Complete sales history with price trends
- All work records with contractor information
- Insurance claim history
- Active and expired warranties
- AI-powered recommendations based on:
  - Frequent sales activity
  - Recent insurance claims
  - Major system updates
  - Warranty expiration warnings
  - Unpermitted work detection
  - Maintenance history gaps

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Add environment variables (if needed)
4. Vercel will automatically detect Next.js and configure the build

### Database for Production

For production, switch to PostgreSQL:
1. Update `prisma/schema.prisma` datasource to PostgreSQL
2. Add `DATABASE_URL` environment variable
3. Run migrations: `npx prisma migrate deploy`

## Development

### Adding Sample Data

You can add sample data through the API endpoints:

```bash
# Create a property
curl -X POST http://localhost:3000/api/properties/create \
  -H "Content-Type: application/json" \
  -d '{
    "address": "123 Main St",
    "city": "Los Angeles",
    "state": "CA",
    "zipCode": "90001",
    "propertyType": "Single Family",
    "yearBuilt": 1995
  }'
```

## Future Enhancements

- [ ] User authentication and authorization
- [ ] Payment integration (Stripe)
- [ ] Email report delivery
- [ ] PDF report generation
- [ ] Property data import from public records
- [ ] Advanced analytics and trends
- [ ] Mobile app
- [ ] Realtor dashboard
- [ ] Bulk report generation

## License

MIT
