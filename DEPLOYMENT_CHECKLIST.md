# Deployment Checklist

## ✅ Changes Made

### 1. Database Configuration (`src/config/database.config.ts`)
**Changed:**
- Removed `NODE_ENV`-based conditional logic
- Set `synchronize: true` (TEMPORARY - see post-deployment steps)
- Removed `migrations` and `migrationsRun` config (not needed with synchronize)
- Ensured DATABASE_URL with SSL support works correctly
- Added clear TODO comment to disable synchronize after first deploy

**Why:**
- Railway runs with `NODE_ENV=production` but we need TypeORM to create tables on first deploy
- `synchronize: true` auto-creates/updates tables from entities
- Must be disabled after first successful deploy to prevent accidental schema changes

### 2. Seed Service (`src/modules/seed/seed.service.ts`)
**Changed:**
- Added comprehensive error handling with try-catch blocks
- Made seeding idempotent (checks if role/user exists before creating)
- Seeds roles BEFORE admin user (ensures foreign key constraint is satisfied)
- Reads admin password from `ADMIN_PASSWORD` env var (falls back to 'admin123' only in dev)
- Added detailed logging with ✅ emojis for success
- Wrapped `onModuleInit` in try-catch so seed failures don't crash the app

**Why:**
- Previous error: "column User.role_id does not exist" meant roles table wasn't created
- Idempotency allows safe redeployments without duplicate key errors
- Environment-based password is more secure than hardcoded default

### 3. User Entity (`src/modules/users/entities/user.entity.ts`)
**Changed:**
- Added clarifying comments to explain `roleId` column and `role` relation

**Why:**
- Prevent confusion about why both `@Column` and `@JoinColumn` reference the same column name
- TypeORM uses `@Column({ name: 'role_id' })` to map the FK, and `@JoinColumn` to define the relationship

---

## 🚀 Deployment Steps

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Fix TypeORM synchronize for Railway deployment with fresh Supabase DB"
git push
```

### Step 2: Set Environment Variables in Railway
Go to Railway → Your Service → Variables tab and add:

| Variable | Value | Example |
|----------|-------|---------|
| `DATABASE_URL` | Your Supabase connection string | `postgresql://postgres.xxx:pass@aws-0-region.pooler.supabase.com:6543/postgres` |
| `JWT_SECRET` | 128-character random hex string | Generate with: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` |
| `ADMIN_PASSWORD` | Secure password for admin user | `MySecurePassword123!` (optional, defaults to `admin123`) |
| `NODE_ENV` | `production` | Should already be set by Railway |

### Step 3: Deploy
- Railway will auto-deploy after you push to GitHub
- Or manually trigger: Railway Dashboard → Deploy

### Step 4: Monitor Logs
Watch Railway logs for:
```
✅ Roles seeded successfully
✅ Admin user created successfully
   Username: admin
🚀 Server is running on: http://0.0.0.0:PORT/api
```

### Step 5: Test the API
```bash
# Replace YOUR_RAILWAY_URL with your actual Railway URL
curl https://YOUR_RAILWAY_URL/api

# Test login
curl -X POST https://YOUR_RAILWAY_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"YOUR_ADMIN_PASSWORD"}'
```

Expected response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "fullName": "System Admin",
    "role": "admin"
  }
}
```

---

## ⚠️ POST-DEPLOYMENT: Disable Synchronize

**CRITICAL:** After your first successful deployment:

### Step 1: Edit `src/config/database.config.ts`
Change line 11 from:
```typescript
synchronize: true, // Temporarily enabled to create tables on Railway + Supabase
```

To:
```typescript
synchronize: false, // Disabled after initial deploy - use migrations for schema changes
```

### Step 2: Commit and Push
```bash
git add src/config/database.config.ts
git commit -m "Disable TypeORM synchronize after successful initial deploy"
git push
```

### Step 3: Verify in Supabase
Open Supabase → Table Editor and verify these tables exist with correct columns:

| Table | Key Columns |
|-------|-------------|
| `roles` | `id`, `name` (3 rows) |
| `users` | `id`, `role_id`, `full_name`, `username`, `password`, `is_active` (1 row: admin) |
| `students` | `id`, `class_id`, `full_name`, `qr_code`, `status`, `total_points` |
| `classes` | `id`, `grade`, `section`, `academic_year` |
| `books` | `id`, `category_id`, `isbn`, `title`, `author`, etc. |
| `categories` | `id`, `name` |
| `book_copies` | `id`, `book_id`, `qr_code`, `shelf_location`, `status`, `acquisition_date` |
| `loans` | `id`, `copy_id`, `student_id`, `librarian_id`, `loan_date`, `due_date`, `return_date`, `renewals_count` |
| `reservations` | `id`, `book_id`, `student_id`, `reserved_at`, `status` |
| `reading_activities` | `id`, `student_id`, `reviewer_id`, `type`, `summary_text`, `status` |
| `points_transactions` | `id`, `student_id`, `activity_id`, `points`, `reason`, `created_at` |
| `audit_logs` | `id`, `user_id`, `action`, `entity_type`, `entity_id`, `details`, `created_at` |

**Verify column names:**
- All foreign keys use snake_case: `role_id`, `class_id`, `student_id`, `book_id`, etc.
- All multi-word columns use snake_case: `full_name`, `is_active`, `qr_code`, `loan_date`, etc.

---

## 🔧 Troubleshooting

### Error: "column User.role_id does not exist"
**Cause:** TypeORM didn't create tables (synchronize was disabled too early)
**Fix:** 
1. Ensure `synchronize: true` in database.config.ts
2. Redeploy on Railway
3. Check logs for table creation messages

### Error: "password authentication failed"
**Cause:** Wrong DATABASE_URL or wrong password in connection string
**Fix:**
1. Go to Supabase → Settings → Database
2. Copy the **Connection pooling** URI (not Direct connection)
3. Update DATABASE_URL in Railway
4. Redeploy

### Error: "JwtStrategy requires a secret or key"
**Cause:** JWT_SECRET not set in Railway environment variables
**Fix:**
1. Generate secret: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`
2. Add to Railway Variables: `JWT_SECRET=<generated_value>`
3. Redeploy

### Admin user not created
**Cause:** Roles weren't seeded first (foreign key constraint failed)
**Fix:**
- Check logs for "Admin role not found" error
- The updated seed service now handles this correctly
- Redeploy should fix it

### Need to reset database
If something goes wrong and you need a clean slate:
```sql
-- Run in Supabase SQL Editor
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;
```
Then redeploy on Railway (with `synchronize: true` still active).

---

## 📋 Summary

**Files Changed:**
1. `src/config/database.config.ts` - Temporarily enabled synchronize
2. `src/modules/seed/seed.service.ts` - Robust error handling, idempotent seeding
3. `src/modules/users/entities/user.entity.ts` - Added clarifying comments

**Next Steps:**
1. ✅ Push to GitHub
2. ✅ Set Railway environment variables (DATABASE_URL, JWT_SECRET, ADMIN_PASSWORD)
3. ✅ Deploy and monitor logs
4. ✅ Test API endpoints
5. ⚠️ **Disable synchronize after first successful deploy**
6. ✅ Verify tables in Supabase Table Editor
