# Railway Environment Variables Setup

After your first successful deployment, you need to configure these environment variables in Railway:

## Required Variables

### 1. DATABASE_URL
Get this from your Supabase project:
- Go to Supabase → Project Settings → Database
- Copy the **Connection string (URI)** under "Connection pooling"
- Should look like: `postgresql://postgres.xxxxx:password@aws-0-region.pooler.supabase.com:6543/postgres`

### 2. JWT_SECRET
Generate a secure random secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 3. ADMIN_PASSWORD (Optional but recommended)
Set a secure password for the admin user. If not set, defaults to `admin123`.

## Railway Configuration Steps

1. Go to your Railway project dashboard
2. Click on your service
3. Go to **Variables** tab
4. Add these variables:

```
DATABASE_URL=<your-supabase-connection-string>
JWT_SECRET=<your-generated-jwt-secret>
ADMIN_PASSWORD=<your-secure-admin-password>
NODE_ENV=production
```

5. Click **Deploy** to redeploy with new variables

## Verify Deployment

1. Check Railway logs for these messages:
   ```
   ✅ Roles seeded successfully
   ✅ Admin user created successfully
      Username: admin
   🚀 Server is running on: http://0.0.0.0:PORT/api
   ```

2. Visit your Railway URL:
   - API root: `https://your-app.railway.app/api`
   - Swagger docs: `https://your-app.railway.app/docs`

3. Test login:
   ```bash
   curl -X POST https://your-app.railway.app/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"username":"admin","password":"your_admin_password"}'
   ```

## After First Successful Deploy

⚠️ **IMPORTANT:** Once your app is deployed and tables are created:

1. **Set `synchronize: false`** in `src/config/database.config.ts` (line 11)
   - Change: `synchronize: true,`
   - To: `synchronize: false,`
   - Remove or update the TODO comment

2. **Commit and redeploy:**
   ```bash
   git add src/config/database.config.ts
   git commit -m "Disable TypeORM synchronize after initial deploy"
   git push
   ```

3. **Verify in Supabase Table Editor:**
   - Open Supabase → Table Editor
   - Verify these tables exist:
     - `roles` (with 3 rows: admin, librarian, supervisor)
     - `users` (with 1 row: admin user)
     - `students`, `classes`, `books`, `categories`, `book_copies`
     - `loans`, `reservations`, `reading_activities`, `points_transactions`
     - `audit_logs`

## Troubleshooting

### If seeding fails:
- Check Railway logs for detailed error messages
- Verify DATABASE_URL is correct (test connection in Supabase)
- Ensure JWT_SECRET is set

### If "role_id does not exist" error appears:
- The schema was not properly synchronized
- Check that `synchronize: true` is active in database.config.ts
- Redeploy to trigger table creation

### If you need to reset the database:
```sql
-- In Supabase SQL Editor
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;
```
Then redeploy on Railway.
