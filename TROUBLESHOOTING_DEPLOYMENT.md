# Troubleshooting: Addresses Not Showing on Deployed Version

## Common Issues & Solutions

### Issue 1: Database Not Seeded in Production ⚠️ MOST LIKELY

**Problem**: The Neon database might be empty or not seeded.

**Solution**: Seed the production database

**Option A: Use the seed API endpoint (Easiest)**

1. Add `SEED_SECRET` to Vercel environment variables (any random string)
2. After deployment, call:
   ```bash
   curl -X POST https://your-app.vercel.app/api/admin/seed \
     -H "Authorization: Bearer YOUR_SEED_SECRET"
   ```

**Option B: Seed directly to Neon**

```bash
export DATABASE_URL="postgresql://neondb_owner:npg_ces9m1CbUXVP@ep-still-leaf-aez6v4p0-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
pnpm run db:seed
```

### Issue 2: DATABASE_URL Not Set in Vercel ⚠️ COMMON

**Problem**: Environment variable not configured correctly.

**Check**:
1. Go to Vercel → Settings → Environment Variables
2. Verify `DATABASE_URL` exists
3. Value should be: `postgresql://neondb_owner:npg_ces9m1CbUXVP@ep-still-leaf-aez6v4p0-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require`
4. Make sure it's enabled for **Production**, **Preview**, and **Development**

**Fix**: Add it if missing, then **redeploy**.

### Issue 3: Wrong Database Connection

**Problem**: Vercel might be connecting to a different database.

**Check**: Visit `https://your-app.vercel.app/api/test-db`

This will show:
- If DATABASE_URL is set
- How many properties are in the database
- Sample data
- Connection status

### Issue 4: Prisma Client Not Generated During Build

**Problem**: Prisma client might not be generated with PostgreSQL types.

**Check**: Look at Vercel build logs for:
- `prisma generate` command
- Any Prisma errors

**Fix**: The `build` script in `package.json` should include:
```json
"build": "prisma generate && next build"
```

This is already set up ✅

### Issue 5: Connection String Format

**Problem**: The connection string might need URL encoding.

**Check**: The connection string should be:
```
postgresql://neondb_owner:npg_ces9m1CbUXVP@ep-still-leaf-aez6v4p0-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

**Note**: The `&` in `channel_binding=require` might need to be `%26` in some cases, but usually Vercel handles this automatically.

## Step-by-Step Debugging

### Step 1: Test Database Connection

Visit: `https://your-app.vercel.app/api/test-db`

**Expected response**:
```json
{
  "success": true,
  "database": "Connected",
  "propertyCount": 5,
  "sampleProperties": [...],
  "autocompleteTest": 1
}
```

**If you see**:
- `"database": "No DATABASE_URL set"` → Add DATABASE_URL to Vercel
- `"propertyCount": 0` → Database is empty, needs seeding
- Error message → Connection issue

### Step 2: Check Vercel Logs

1. Go to Vercel → Your Project → Deployments
2. Click on the latest deployment
3. Check "Build Logs" and "Function Logs"
4. Look for:
   - Prisma errors
   - Database connection errors
   - Environment variable warnings

### Step 3: Verify Data in Neon

1. Go to https://console.neon.tech
2. Open your project
3. Go to "SQL Editor"
4. Run:
   ```sql
   SELECT COUNT(*) FROM properties;
   ```
5. Should return: `5` (or however many you seeded)

### Step 4: Seed Production Database

If the database is empty:

**Quick Method**: Use the seed API endpoint

1. Add to Vercel environment variables:
   - Name: `SEED_SECRET`
   - Value: `your-random-secret-123` (any string)

2. After deployment, run:
   ```bash
   curl -X POST https://your-app.vercel.app/api/admin/seed \
     -H "Authorization: Bearer your-random-secret-123"
   ```

**Manual Method**: Seed directly

```bash
export DATABASE_URL="postgresql://neondb_owner:npg_ces9m1CbUXVP@ep-still-leaf-aez6v4p0-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
pnpm run db:seed
```

## Quick Fix Checklist

- [ ] DATABASE_URL is set in Vercel environment variables
- [ ] DATABASE_URL is enabled for Production, Preview, Development
- [ ] Database has been seeded (check with `/api/test-db`)
- [ ] Vercel deployment completed successfully
- [ ] No errors in Vercel build/function logs
- [ ] Test endpoint shows data: `/api/test-db`

## Most Likely Solution

**90% chance**: The database needs to be seeded in production.

**Quick fix**:
1. Visit: `https://your-app.vercel.app/api/test-db`
2. If `propertyCount: 0`, the database is empty
3. Seed it using one of the methods above

