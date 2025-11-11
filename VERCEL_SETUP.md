# Vercel Deployment Setup

## Important: Root Directory Configuration

**You MUST update the Root Directory in Vercel Dashboard:**

1. Go to your Vercel project: https://vercel.com/dashboard
2. Click on your **TrueHome** project
3. Go to **Settings** → **General**
4. Scroll down to **Root Directory**
5. **Clear the field completely** (leave it blank/empty)
6. Click **Save**

The Root Directory field should be **empty/blank**, NOT `apps/web` or `.` or anything else.

## Why This Error Occurs

The error `/vercel/path0/apps/web/.next/routes-manifest.json` means Vercel is looking for files in the `apps/web` directory, which doesn't exist in this project structure.

This project is a **single Next.js app at the root level**, not a monorepo.

## After Fixing Root Directory

1. Go to **Deployments** tab
2. Click the **"..."** menu on the latest deployment
3. Click **"Redeploy"**
4. The build should now work correctly

## Project Structure

```
truehome/          ← Root (where Vercel should build from)
├── app/            ← Next.js app directory
├── lib/            ← Shared libraries
├── prisma/         ← Database schema
├── package.json    ← Dependencies
├── next.config.js  ← Next.js config
└── vercel.json     ← Vercel config
```

