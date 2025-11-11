# Vercel Database Setup Guide

## Problem
SQLite files don't work on Vercel's serverless functions. You need a PostgreSQL database for production.

## Solution Options

### Option 1: Vercel Postgres (Recommended - Easiest)

1. **Go to your Vercel project dashboard**
2. **Navigate to Storage tab**
3. **Click "Create Database"**
4. **Select "Postgres"**
5. **Create the database** (it will automatically add the `POSTGRES_PRISMA_URL` environment variable)

6. **Update Prisma schema for production:**
   - The schema will automatically use `DATABASE_URL` from environment variables
   - Vercel Postgres provides `POSTGRES_PRISMA_URL` which you can map to `DATABASE_URL`

7. **Add environment variable in Vercel:**
   - Go to Settings → Environment Variables
   - Add: `DATABASE_URL` = `POSTGRES_PRISMA_URL` (or copy the connection string)

8. **Update schema.prisma to support both SQLite and PostgreSQL:**
   ```prisma
   datasource db {
     provider = "sqlite"  // Change to "postgresql" for production
     url      = env("DATABASE_URL")
   }
   ```

### Option 2: External PostgreSQL Database

1. **Set up a PostgreSQL database:**
   - Use services like:
     - **Neon** (free tier available): https://neon.tech
     - **Supabase** (free tier available): https://supabase.com
     - **Railway** (free tier available): https://railway.app
     - **Render** (free tier available): https://render.com

2. **Get the connection string** from your database provider

3. **Add to Vercel Environment Variables:**
   - Go to Settings → Environment Variables
   - Add: `DATABASE_URL` = `your-postgres-connection-string`

4. **Update Prisma schema:**
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

## Steps to Deploy

### 1. Set up the database (choose one option above)

### 2. Update Prisma Schema

For production, you'll need to change the provider. You can either:
- Use separate schemas for dev/prod
- Or use PostgreSQL for both (recommended)

**Update `prisma/schema.prisma`:**
```prisma
datasource db {
  provider = "postgresql"  // Changed from sqlite
  url      = env("DATABASE_URL")
}
```

### 3. Push Schema to Production Database

After setting up the database, run:
```bash
# This will create the tables in your production database
pnpm prisma db push
```

Or use migrations:
```bash
pnpm prisma migrate dev --name init
pnpm prisma migrate deploy  # For production
```

### 4. Seed the Production Database

**Option A: Add seed to build process (Recommended)**

Update `vercel.json`:
```json
{
  "buildCommand": "pnpm run build && pnpm run db:seed",
  "installCommand": "pnpm install --no-frozen-lockfile",
  "framework": "nextjs"
}
```

**Option B: Run seed manually after deployment**

1. Connect to your production database
2. Run: `DATABASE_URL="your-prod-url" pnpm run db:seed`

**Option C: Create a seed API endpoint (for one-time use)**

Create `app/api/admin/seed/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export async function POST(request: NextRequest) {
  // Add authentication/authorization check here
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.SEED_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await execAsync('pnpm run db:seed')
    return NextResponse.json({ success: true, message: 'Database seeded' })
  } catch (error) {
    return NextResponse.json({ error: 'Seeding failed' }, { status: 500 })
  }
}
```

Then call it once: `POST /api/admin/seed` with the secret token.

### 5. Deploy to Vercel

1. Push your changes to GitHub
2. Vercel will automatically deploy
3. The database will be seeded (if you added it to buildCommand)

## Quick Setup with Neon (Free PostgreSQL)

1. **Sign up at https://neon.tech**
2. **Create a new project**
3. **Copy the connection string** (looks like: `postgresql://user:pass@host/dbname`)
4. **Add to Vercel:**
   - Settings → Environment Variables
   - `DATABASE_URL` = your connection string
5. **Update schema.prisma:**
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
6. **Run migrations:**
   ```bash
   pnpm prisma migrate dev --name init
   ```
7. **Seed the database:**
   ```bash
   DATABASE_URL="your-neon-url" pnpm run db:seed
   ```
8. **Deploy to Vercel**

## Important Notes

- **Never commit `.env` files** - they're in `.gitignore`
- **SQLite won't work on Vercel** - you must use PostgreSQL
- **Seed data is only needed once** - after initial setup
- **Use environment variables** for database URLs
- **Test locally** with PostgreSQL before deploying

## Troubleshooting

### "Database not found" error
- Check that `DATABASE_URL` is set in Vercel environment variables
- Verify the connection string is correct
- Make sure the database exists and is accessible

### "Table does not exist" error
- Run `pnpm prisma db push` or `pnpm prisma migrate deploy`
- Check that migrations ran successfully

### Seed not running
- Check build logs in Vercel
- Verify `db:seed` script is in package.json
- Make sure `tsx` is installed as a dependency

