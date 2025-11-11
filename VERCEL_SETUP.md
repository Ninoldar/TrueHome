# Vercel Deployment Setup Guide

## ✅ Pre-Deployment Checklist

### 1. Project Structure
- ✅ Next.js app in `apps/web`
- ✅ Monorepo structure with shared packages
- ✅ Environment variables configured

### 2. Configuration Files Created
- ✅ `apps/web/vercel.json` - Vercel project config
- ✅ `.vercelignore` - Files to exclude from deployment
- ✅ Updated `next.config.js` for production API routing

## 🚀 Deployment Steps

### Step 1: Deploy to Vercel

1. **Go to Vercel Dashboard**
   - Visit https://vercel.com/new
   - Click "Import Git Repository"
   - Select `Ninoldar/TrueHome`

2. **Configure Project Settings**
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** `apps/web` ⚠️ IMPORTANT
   - **Build Command:** `cd ../.. && npm install && npm run build`
   - **Output Directory:** `.next` (default)
   - **Install Command:** `cd ../.. && npm install`

3. **Environment Variables**
   Add these in Vercel project settings:
   ```
   DATABASE_URL=your_production_database_url
   NEXT_PUBLIC_API_URL=https://your-api-url.railway.app
   ```
   
   **OR** if deploying API separately:
   ```
   DATABASE_URL=your_production_database_url
   NEXT_PUBLIC_API_URL=/api
   API_URL=https://your-api-url.railway.app
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete

### Step 2: Deploy API (NestJS Backend)

Since Vercel is primarily for frontend, deploy the API separately:

#### Option A: Railway.app (Recommended - Free Tier)
1. Go to https://railway.app
2. New Project → Deploy from GitHub
3. Select `Ninoldar/TrueHome`
4. Configure:
   - **Root Directory:** `apps/api`
   - **Build Command:** `cd ../.. && npm install && npm run build`
   - **Start Command:** `cd apps/api && npm run start`
5. Add Environment Variables:
   ```
   DATABASE_URL=your_production_database_url
   PORT=4000
   FRONTEND_URL=https://your-vercel-app.vercel.app
   ```
6. Get the Railway URL and update `NEXT_PUBLIC_API_URL` in Vercel

#### Option B: Render.com (Free Tier)
1. Go to https://render.com
2. New → Web Service
3. Connect GitHub repo
4. Configure:
   - **Root Directory:** `apps/api`
   - **Build Command:** `cd ../.. && npm install && npm run build`
   - **Start Command:** `cd apps/api && npm run start`
5. Add same environment variables as Railway

### Step 3: Database Setup

#### Option A: Vercel Postgres
1. In Vercel dashboard → Storage → Create Database
2. Select Postgres
3. Copy connection string to `DATABASE_URL`

#### Option B: Supabase (Free Tier)
1. Go to https://supabase.com
2. Create new project
3. Get connection string from Settings → Database
4. Use for `DATABASE_URL`

#### Option C: Neon (Free Tier)
1. Go to https://neon.tech
2. Create new project
3. Get connection string
4. Use for `DATABASE_URL`

### Step 4: Run Database Migrations

```bash
# Set production DATABASE_URL
export DATABASE_URL="your_production_database_url"

# Generate Prisma client
cd packages/db && npx prisma generate

# Run migrations
cd packages/db && npx prisma migrate deploy

# (Optional) Seed sample data
cd apps/api && DATABASE_URL="your_production_database_url" npm run db:seed
```

## 🔧 Configuration Details

### Next.js Rewrites
The `next.config.js` is configured to:
- Use `NEXT_PUBLIC_API_URL` for production API
- Fallback to localhost for development
- Support both external API URLs and relative paths

### Environment Variables

**Vercel (Frontend):**
- `DATABASE_URL` - Not needed (only for API)
- `NEXT_PUBLIC_API_URL` - Your API URL (Railway/Render)
- `API_URL` - Internal API URL (for rewrites)

**Railway/Render (Backend):**
- `DATABASE_URL` - Production database
- `PORT` - Server port (default 4000)
- `FRONTEND_URL` - Your Vercel app URL (for CORS)

## 🐛 Troubleshooting

### Build Fails
- **Error:** "Cannot find module"
  - Solution: Ensure `installCommand` runs from root: `cd ../.. && npm install`

- **Error:** "Prisma client not generated"
  - Solution: Add to build command: `cd packages/db && npx prisma generate`

### API Not Working
- **Error:** CORS errors
  - Solution: Update `FRONTEND_URL` in API environment variables

- **Error:** 404 on `/api/*`
  - Solution: Check `NEXT_PUBLIC_API_URL` is set correctly
  - Verify API is deployed and accessible

### Database Connection
- **Error:** Connection refused
  - Solution: Check `DATABASE_URL` format
  - Ensure database allows external connections
  - Run migrations on production database

## 📝 Recommended Build Command

For Vercel, use:
```bash
cd ../.. && npm install && cd packages/db && npx prisma generate && cd ../../apps/web && npm run build
```

Or update `package.json` scripts to handle this.

## ✅ Post-Deployment

1. **Test the deployment:**
   - Visit your Vercel URL
   - Test search functionality
   - Test property detail pages

2. **Monitor:**
   - Check Vercel logs for errors
   - Check Railway/Render logs for API errors
   - Monitor database connections

3. **Update CORS:**
   - In API settings, add Vercel URL to allowed origins

## 🎯 Quick Deploy Checklist

- [ ] Code pushed to GitHub
- [ ] Vercel project created
- [ ] Root directory set to `apps/web`
- [ ] Environment variables added
- [ ] API deployed to Railway/Render
- [ ] Database created and migrations run
- [ ] CORS configured in API
- [ ] Test deployment

