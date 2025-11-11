# Quick Start Guide

Get the TrueHome MVP running in 5 minutes!

## Prerequisites Check

- ✅ Node.js 18+ installed
- ✅ Docker Desktop running
- ✅ Terminal/Command line access

## Step-by-Step Setup

### 1. Install Dependencies (2 minutes)

\`\`\`bash
npm install
\`\`\`

### 2. Start Infrastructure (1 minute)

\`\`\`bash
npm run docker:up
\`\`\`

Wait ~30 seconds for services to start. Check with:
\`\`\`bash
docker ps
\`\`\`

### 3. Set Up Database (1 minute)

\`\`\`bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed sample data
npm run db:seed
\`\`\`

You should see:
\`\`\`
🎉 Data seeding completed successfully!
📊 Summary:
{
  "properties": 5,
  "sales": 12,
  "ownershipEvents": 10,
  "permits": 11,
  "workEvents": 7,
  "rentalSignals": 2,
  "insuranceClaims": 4
}
\`\`\`

### 4. Start Servers (1 minute)

**Terminal 1 - API:**
\`\`\`bash
cd apps/api
npm run dev
\`\`\`

**Terminal 2 - Web:**
\`\`\`bash
cd apps/web
npm run dev
\`\`\`

### 5. Open Browser

Visit: **http://localhost:3000**

## Try It Out!

1. **Search**: Try "Plano", "Main Street", or "75023"
2. **Click a property** to see full history
3. **Explore**: Check out ownership, sales, permits, work events

## Sample Searches

- `Plano` - Find Plano properties
- `Main Street` - Find the Main Street property
- `75023` - Find properties in ZIP 75023
- `123456789` - Find by APN

## Troubleshooting

**Port already in use?**
- Change API port: Edit `.env` → `API_PORT=4001`
- Change web port: Edit `apps/web/package.json` → `"dev": "next dev -p 3001"`

**Database connection error?**
\`\`\`bash
# Check Docker is running
docker ps

# Restart services
npm run docker:down
npm run docker:up
\`\`\`

**Prisma errors?**
\`\`\`bash
cd packages/db
npm install
npm run generate
\`\`\`

## What's Next?

- Read `MVP_SETUP.md` for detailed setup
- Read `MVP_SUMMARY.md` for feature overview
- Explore the codebase in `apps/` and `packages/`

---

**That's it!** You now have a working MVP with 5 properties and rich history data. 🎉
