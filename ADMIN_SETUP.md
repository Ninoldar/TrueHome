# Admin Dashboard Setup Guide

This guide will help you create an admin account and access the admin dashboard.

## Creating an Admin Account

### Option 1: Using the Script (Recommended)

Run the create-admin script with your desired credentials:

```bash
# Default admin (admin@truehome.com / admin123)
pnpm run create-admin

# Custom admin
pnpm run create-admin your-email@example.com your-password "Admin Name"
```

### Option 2: Manual Database Update

If you already have a user account, you can update their role to ADMIN:

1. Open Prisma Studio:
   ```bash
   pnpm db:studio
   ```

2. Navigate to the `users` table
3. Find your user
4. Change the `role` field from `BUYER` to `ADMIN`
5. Save

### Option 3: Direct SQL (PostgreSQL)

If using Neon/PostgreSQL, you can run:

```sql
UPDATE users 
SET role = 'ADMIN' 
WHERE email = 'your-email@example.com';
```

## Accessing the Admin Dashboard

1. Sign in with your admin account
2. You'll see an "Admin" button in the header (next to Dashboard)
3. Click "Admin" or navigate to `/admin`

## Admin Dashboard Features

### Overview Tab
- **Total Users**: Count of all registered users
- **Total Reports**: Count of all generated reports
- **Total Revenue**: Sum of all credit purchases and report purchases
- **Credits Sold**: Total number of credits purchased
- **Recent User Sign-ups**: Last 10 users who registered
- **Recent Credit Purchases**: Last 10 credit pack purchases

### Users Tab
- View all registered users
- See user roles (BUYER, REALTOR, ADMIN)
- View user activity (reports purchased, credits bought)

### Reports Tab
- View all generated reports
- See which properties have reports
- Track report generation activity

### Revenue Tab
- Total revenue analytics
- Revenue per user
- Credit sales statistics

## Security Notes

- ✅ Only users with `role = 'ADMIN'` can access `/admin`
- ✅ Admin API endpoints check for admin role
- ✅ Non-admin users are redirected to their dashboard
- ⚠️ Change default admin password after first login
- ⚠️ Keep admin credentials secure

## API Endpoints

- `GET /api/admin/stats` - Get admin dashboard statistics (admin only)

## Troubleshooting

### Can't see Admin button
- Make sure you're signed in
- Verify your user role is `ADMIN` in the database
- Sign out and sign back in to refresh your session

### 403 Forbidden when accessing /admin
- Your user role is not set to `ADMIN`
- Update your role in the database (see Option 2 or 3 above)
- Sign out and sign back in

### Admin dashboard shows no data
- Check that you have users, reports, and purchases in the database
- Run the seed script to add sample data: `pnpm db:seed`

