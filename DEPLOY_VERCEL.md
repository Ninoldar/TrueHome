# Deploying to Vercel

## Prerequisites

1. **GitHub Repository**
   - Push your code to GitHub first
   - Vercel will connect to your GitHub repo

2. **Vercel Account**
   - Sign up at https://vercel.com
   - Connect your GitHub account

## Deployment Steps

### 1. Push to GitHub

If you haven't set up a remote yet:

\`\`\`bash
# Create a new repository on GitHub first, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
\`\`\`

### 2. Deploy on Vercel

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Configure the project:

#### Root Directory
- Set to: `apps/web` (since Next.js is in apps/web)

#### Build Settings
- **Framework Preset:** Next.js
- **Root Directory:** `apps/web`
- **Build Command:** `cd ../.. && npm install && npm run build`
- **Output Directory:** `apps/web/.next`

#### Environment Variables
Add these in Vercel dashboard:

\`\`\`
DATABASE_URL=your_production_database_url
NEXT_PUBLIC_API_URL=/api
\`\`\`

#### Monorepo Configuration

Since this is a monorepo, you may need to:

1. **Option A: Use Vercel's Monorepo Support**
   - In Vercel project settings, set:
     - Root Directory: `apps/web`
     - Build Command: `cd ../.. && npm install && npm run build`
     - Output Directory: `.next`

2. **Option B: Deploy API Separately**
   - Deploy Next.js app to Vercel
   - Deploy NestJS API to a separate service (Railway, Render, etc.)
   - Update `NEXT_PUBLIC_API_URL` to point to API URL

### 3. API Deployment Options

Since you have a NestJS backend, you have a few options:

#### Option A: Deploy API to Railway/Render
1. Create account on Railway.app or Render.com
2. Connect GitHub repo
3. Set root directory to `apps/api`
4. Set build command: `cd ../.. && npm install && npm run build`
5. Set start command: `cd apps/api && npm run start`
6. Update `NEXT_PUBLIC_API_URL` in Vercel to point to Railway/Render URL

#### Option B: Use Vercel Serverless Functions
- Convert API routes to Vercel serverless functions
- More complex but keeps everything in one place

#### Option C: Deploy API to Vercel (Experimental)
- Vercel can run Node.js apps
- May need custom configuration

### 4. Database Setup

For production, you'll need:

1. **PostgreSQL Database**
   - Use Vercel Postgres, Supabase, or Neon
   - Get connection string
   - Add to environment variables

2. **Run Migrations**
   \`\`\`bash
   DATABASE_URL=your_prod_url npm run db:migrate
   \`\`\`

3. **Seed Data (Optional)**
   \`\`\`bash
   DATABASE_URL=your_prod_url npm run db:seed
   \`\`\`

### 5. Environment Variables Checklist

Add these in Vercel dashboard:

\`\`\`
# Database
DATABASE_URL=postgresql://user:pass@host:5432/dbname

# API (if deployed separately)
NEXT_PUBLIC_API_URL=https://your-api-url.com

# CORS (for API)
FRONTEND_URL=https://your-vercel-app.vercel.app
\`\`\`

## Quick Deploy Commands

\`\`\`bash
# 1. Push to GitHub
git push origin main

# 2. Then go to Vercel and import repo
# 3. Configure settings as above
# 4. Deploy!
\`\`\`

## Troubleshooting

### Build Fails
- Check that root directory is set correctly
- Ensure all dependencies are in package.json
- Check build logs in Vercel dashboard

### API Not Working
- Verify `NEXT_PUBLIC_API_URL` is set correctly
- Check CORS settings in API
- Ensure API is deployed and accessible

### Database Connection Issues
- Verify DATABASE_URL is correct
- Check database allows connections from Vercel IPs
- Run migrations on production database

## Recommended Setup

1. **Frontend (Next.js):** Vercel
2. **Backend (NestJS):** Railway.app or Render.com
3. **Database:** Vercel Postgres, Supabase, or Neon
4. **Redis/OpenSearch:** Only if needed for MVP

For MVP, you can start with:
- Frontend on Vercel
- API on Railway (free tier available)
- Database on Supabase (free tier available)
