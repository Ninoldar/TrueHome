# Vercel Deployment Fix

## Issue
Vercel is removing `apps/api` files during build, which is correct since we're using Next.js API routes now. However, we need to ensure:

1. **Root Directory**: Set to `apps/web` in Vercel project settings
2. **Build Command**: Should build Next.js app
3. **Environment Variables**: DATABASE_URL must be set

## Vercel Project Settings

### Root Directory
- Set to: `apps/web`

### Build Settings
- **Framework Preset**: Next.js (auto-detected)
- **Build Command**: `cd ../.. && npm install && cd apps/web && npm run build`
- **Output Directory**: `.next` (default)
- **Install Command**: `cd ../.. && npm install`

### Environment Variables
Add these in Vercel dashboard:
\`\`\`
DATABASE_URL=your_production_database_url
\`\`\`

## Important Notes

1. **No Separate API Server**: All API routes are in `apps/web/src/app/api/`
2. **No Rewrites Needed**: Next.js API routes work natively
3. **Prisma Client**: Must be generated before build
4. **Database**: Must be accessible from Vercel

## Build Process

1. Vercel clones repo
2. Runs `npm install` from root (monorepo)
3. Generates Prisma client
4. Builds Next.js app from `apps/web`
5. Deploys to Vercel edge network

## Troubleshooting

If build fails:
1. Check that `DATABASE_URL` is set
2. Verify Prisma client is generated
3. Ensure all API routes are in `apps/web/src/app/api/`
4. Check build logs for specific errors
