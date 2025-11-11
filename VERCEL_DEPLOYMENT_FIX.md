# Vercel Deployment Configuration

## Root Directory Setting

**CRITICAL:** In Vercel Dashboard → Project Settings → General:

Set **Root Directory** to: `apps/web`

⚠️ **This MUST be set in the Vercel Dashboard, NOT in vercel.json** (vercel.json doesn't support rootDirectory property)

This tells Vercel where your Next.js app is located in the monorepo.

## Build Settings

Vercel should auto-detect these, but verify:

- **Framework Preset:** Next.js
- **Root Directory:** `apps/web` ⚠️ CRITICAL
- **Build Command:** (uses vercel.json)
- **Output Directory:** `.next`
- **Install Command:** (uses vercel.json)

## Environment Variables

Add in Vercel Dashboard → Settings → Environment Variables:

```
DATABASE_URL=your_production_database_url
```

## Build Process

The build command in `apps/web/vercel.json`:
1. Goes to monorepo root (`cd ../..`)
2. Installs all dependencies (`npm install`)
3. Generates Prisma client (`cd packages/db && npx prisma generate`)
4. Builds Next.js app (`cd ../../apps/web && npm run build`)

## Troubleshooting

### Error: "No Next.js version detected"

**Solution:** 
1. Go to Vercel Dashboard → Project Settings → General
2. Set **Root Directory** to: `apps/web`
3. Save and redeploy

### Error: "@truehome/db not found"

**Fixed:** All API routes now use `@prisma/client` directly.

### Error: "Prisma client not generated"

**Fixed:** Build command includes `npx prisma generate` step.

## Verification

After setting Root Directory to `apps/web`, Vercel should:
- ✅ Detect Next.js 14.0.4
- ✅ Find package.json in apps/web
- ✅ Build successfully
