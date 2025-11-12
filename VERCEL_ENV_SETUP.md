# Vercel Environment Variable Setup

## ✅ Database Setup Complete!

Your Neon PostgreSQL database is now set up with:
- ✅ All tables created
- ✅ 5 sample properties seeded
- ✅ Ready for production

## Next Step: Add to Vercel

### 1. Go to Vercel Dashboard
1. Navigate to your project: https://vercel.com/dashboard
2. Click on your **TrueHome** project
3. Go to **Settings** → **Environment Variables**

### 2. Add DATABASE_URL

Click **"Add New"** and enter:

**Name:**
```
DATABASE_URL
```

**Value:**
```
postgresql://neondb_owner:npg_ces9m1CbUXVP@ep-still-leaf-aez6v4p0-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

**Environments:** 
- ✅ Production
- ✅ Preview  
- ✅ Development

Click **"Save"**

### 3. Redeploy

After adding the environment variable:

1. Go to **Deployments** tab
2. Click the **"..."** menu on the latest deployment
3. Click **"Redeploy"**
4. Or push a new commit to trigger automatic deployment

### 4. Verify It Works

After deployment, test your production site:
- Search should work
- Properties should show up
- Reports should generate

## Security Reminder

⚠️ **Important**: Your connection string contains credentials. 

- ✅ Already in `.gitignore` (won't be committed)
- ✅ Safe to use in Vercel environment variables (encrypted)
- ❌ Never commit to GitHub
- ❌ Never share publicly

## Testing Locally

Your local setup is already configured via `.env.local`:
- The file is gitignored
- Contains your Neon connection string
- Works with `pnpm dev`

## Troubleshooting

### If search doesn't work on Vercel:
1. Check that `DATABASE_URL` is set in Vercel
2. Check deployment logs for errors
3. Verify the connection string is correct
4. Make sure you redeployed after adding the variable

### If you see "Table does not exist":
- The schema was already pushed to Neon ✅
- This shouldn't happen, but if it does, run:
  ```bash
  DATABASE_URL="your-url" pnpm prisma db push
  ```

## Next Steps

1. ✅ Database is set up
2. ✅ Data is seeded
3. ⏭️ Add to Vercel (follow steps above)
4. ⏭️ Redeploy
5. ⏭️ Test production site

Your database is ready! 🎉

