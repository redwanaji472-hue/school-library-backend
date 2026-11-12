# Quick Deploy Guide - Railway + Supabase

## 🚀 3-Minute Deployment

### Step 1: Push Code
```bash
git add .
git commit -m "Fix TypeORM sync for Railway with fresh Supabase DB"
git push
```

### Step 2: Set Railway Environment Variables
Go to **Railway Dashboard → Your Service → Variables**

| Variable | How to Get It |
|----------|---------------|
| `DATABASE_URL` | Supabase → Settings → Database → Connection pooling URI |
| `JWT_SECRET` | Run: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` |
| `ADMIN_PASSWORD` | Choose a secure password (optional, defaults to `admin123`) |

Click **Save** (Railway will auto-deploy)

### Step 3: Wait for Deployment
Watch Railway logs for:
```
✅ Roles seeded successfully
✅ Admin user created successfully
🚀 Server is running on: http://0.0.0.0:PORT/api
```

### Step 4: Test
```bash
curl https://YOUR_APP.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"YOUR_ADMIN_PASSWORD"}'
```

---

## ⚠️ AFTER FIRST SUCCESSFUL DEPLOY

**CRITICAL - DO NOT SKIP:**

### 1. Edit `src/config/database.config.ts` (line 11)
Change:
```typescript
synchronize: true,
```
To:
```typescript
synchronize: false,
```

### 2. Commit and Push
```bash
git add src/config/database.config.ts
git commit -m "Disable synchronize after initial deploy"
git push
```

---

## 📋 Verification

Open **Supabase → Table Editor** and verify:
- ✅ 12 tables created
- ✅ `roles` table has 3 rows
- ✅ `users` table has 1 row (admin)
- ✅ All columns use snake_case (`role_id`, `full_name`, `is_active`)

---

## 🆘 Troubleshooting

| Error | Fix |
|-------|-----|
| Tables not created | Verify `synchronize: true` in database.config.ts |
| JwtStrategy error | Add `JWT_SECRET` to Railway variables |
| Password auth failed | Check DATABASE_URL (must be connection pooling URI from Supabase) |
| Admin not created | Check logs for "Admin role not found" - roles should seed first |

**For detailed explanations, see:**
- `FIXES_SUMMARY.md` - Complete analysis of changes
- `DEPLOYMENT_CHECKLIST.md` - Step-by-step guide
- `RAILWAY_ENV_SETUP.md` - Environment variables reference
