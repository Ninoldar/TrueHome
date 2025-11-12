# Neon.tech PostgreSQL Setup Guide

## Step-by-Step Setup

### Step 1: Create Neon Account & Database

1. **Go to https://neon.tech**
2. **Sign up** (free account)
3. **Create a new project**
   - Project name: `truehome` (or any name)
   - Region: Choose closest to you (e.g., `US East`)
   - PostgreSQL version: Latest (15 or 16)
4. **Click "Create Project"**

### Step 2: Get Connection String

After creating the project, you'll see:
- **Connection string** (looks like: `postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require`)

**IMPORTANT**: Copy this connection string - you'll need it!

### Step 3: Update Prisma Schema

The schema needs to be updated to use PostgreSQL instead of SQLite.

**Changes needed:**
- Change `provider = "sqlite"` to `provider = "postgresql"`
- Keep `url = env("DATABASE_URL")` (this is already correct)

### Step 4: Set Environment Variables

#### Local Development (.env file)

Create/update `.env` file in project root:
```env
# Local SQLite (for development)
DATABASE_URL="file:./prisma/dev.db"

# OR use Neon for local development too:
# DATABASE_URL="postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require"
```

#### Vercel Production

1. Go to your Vercel project dashboard
2. Settings → Environment Variables
3. Add new variable:
   - **Name**: `DATABASE_URL`
   - **Value**: Your Neon connection string
   - **Environment**: Production, Preview, Development (check all)
4. Click "Save"

### Step 5: Install Dependencies

No additional packages needed - Prisma already supports PostgreSQL!

### Step 6: Generate Prisma Client

```bash
pnpm prisma generate
```

### Step 7: Push Schema to Neon Database

This creates all the tables in your Neon database:

```bash
# Using your Neon connection string
DATABASE_URL="your-neon-connection-string" pnpm prisma db push
```

Or set it in `.env` first, then:
```bash
pnpm prisma db push
```

### Step 8: Seed the Database

Populate with sample data:

```bash
# Using your Neon connection string
DATABASE_URL="your-neon-connection-string" pnpm run db:seed
```

Or if DATABASE_URL is in `.env`:
```bash
pnpm run db:seed
```

### Step 9: Verify It Works

Check that data was created:
```bash
pnpm prisma studio
# This will open Prisma Studio in your browser
# You should see your properties in the database
```

## What You Need to Provide

To complete the setup, I need:

1. **Your Neon connection string** (after you create the project)
   - Format: `postgresql://user:password@host/database?sslmode=require`
   - You'll get this from Neon dashboard

2. **Confirmation** that you've:
   - Created the Neon project
   - Copied the connection string
   - Ready to update the schema

## Quick Commands Reference

```bash
# 1. Generate Prisma client
pnpm prisma generate

# 2. Push schema to database (creates tables)
DATABASE_URL="your-neon-url" pnpm prisma db push

# 3. Seed database (adds sample data)
DATABASE_URL="your-neon-url" pnpm run db:seed

# 4. View database in browser
DATABASE_URL="your-neon-url" pnpm prisma studio
```

## Troubleshooting

### "Connection refused" error
- Check that your Neon project is active
- Verify the connection string is correct
- Make sure `sslmode=require` is in the connection string

### "Table does not exist" error
- Run `pnpm prisma db push` to create tables
- Check that schema.prisma has `provider = "postgresql"`

### "Authentication failed" error
- Regenerate connection string in Neon dashboard
- Make sure you copied the full string including password

## Next Steps After Setup

1. ✅ Update Prisma schema to PostgreSQL
2. ✅ Push schema to Neon
3. ✅ Seed database with sample data
4. ✅ Add DATABASE_URL to Vercel environment variables
5. ✅ Deploy to Vercel
6. ✅ Test on production

## Important Notes

- **Neon Free Tier**: 
  - 0.5 GB storage
  - Unlimited projects
  - Perfect for MVP/demo
  
- **Connection String Security**:
  - Never commit `.env` files
  - Keep connection strings secret
  - Use environment variables in Vercel

- **Development vs Production**:
  - You can use SQLite locally and PostgreSQL in production
  - Or use PostgreSQL for both (recommended for consistency)

