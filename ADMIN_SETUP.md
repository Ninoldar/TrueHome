# Admin Dashboard Setup

## Making a User an Admin

To make a user an admin, run the following command:

```bash
npm run make-admin <email>
```

For example:
```bash
npm run make-admin nguyen.jonathan1@gmail.com
```

Or using pnpm:
```bash
pnpm make-admin nguyen.jonathan1@gmail.com
```

## After Making a User Admin

1. **Sign out and sign back in** - The session needs to refresh to pick up the new role
2. **Check the dropdown menu** - You should now see "Admin Dashboard" option in the user dropdown
3. **Access the admin dashboard** - Click on "Admin Dashboard" to view admin statistics

## Troubleshooting

If the Admin Dashboard option doesn't appear:

1. **Check the role in the database:**
   - The user's role should be exactly `"admin"` (lowercase)
   - You can verify this by checking the database directly

2. **Sign out and sign back in:**
   - NextAuth caches the session, so you need to sign out and sign back in after changing the role

3. **Check browser console:**
   - In development mode, the header will log the user's role to the console
   - Look for `[Header] User role:` in the browser console

4. **Verify the session:**
   - The session should include `user.role` property
   - Check the browser console for the full session object

## Admin Dashboard Features

The admin dashboard provides:
- Total users count
- Total reports count
- Total revenue
- Today's signups
- Today's reports
- Today's revenue
- Recent users list
- Recent reports list

