# استكشاف أخطاء Vercel 🔧

دليل شامل لحل جميع مشاكل النشر على Vercel.

---

## 🐛 المشكلة الحالية: 404

```
https://school-library-backend.vercel.app → 404
```

---

## ✅ الإصلاحات المطبقة

### 1. ملف `vercel.json` محدّث

```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/main.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/main.ts"
    }
  ],
  "env": {
    "VERCEL": "1"
  }
}
```

### 2. ملف `.vercelignore` مُضاف

يمنع رفع ملفات غير ضرورية.

### 3. ملف `src/main.ts` جاهز

الملف مُعد بشكل صحيح للـ serverless مع:
- Express adapter
- Caching للـ app instance
- Swagger من CDN
- Handler للـ Vercel

---

## 🔍 التشخيص الكامل

### الأسباب المحتملة للـ 404

#### 1. Environment Variables ناقصة ⚠️

**التحقق:**
- اذهب إلى Vercel Dashboard
- Settings → Environment Variables
- تأكد من وجود:
  ```
  NODE_ENV=production
  DATABASE_URL=postgresql://...
  JWT_SECRET=...
  ```

**الحل:**
```bash
# في Vercel Dashboard أضف:
NODE_ENV=production
DATABASE_URL=<your-supabase-connection-pooler-url>
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
```

#### 2. Build فشل ⚠️

**التحقق:**
- Vercel Dashboard → Deployments
- اضغط على آخر deployment
- راجع Build Logs

**الحل:**
```bash
# تأكد من أن Build ينجح محلياً:
npm install
npm run build

# إذا فشل، راجع الأخطاء وأصلحها
```

#### 3. Database Connection فشلت ⚠️

**التحقق:**
- راجع Runtime Logs في Vercel
- ابحث عن أخطاء مثل:
  ```
  ECONNREFUSED
  authentication failed
  SSL required
  ```

**الحل:**
```bash
# تأكد من:
# 1. DATABASE_URL صحيح
# 2. استخدام Connection Pooler (pgbouncer)
# 3. SSL enabled

# مثال:
DATABASE_URL=postgresql://user:pass@host.supabase.co:6543/postgres?pgbouncer=true&sslmode=require
```

#### 4. Migrations لم تعمل ⚠️

**التحقق:**
```sql
-- اتصل بقاعدة البيانات:
SELECT * FROM migrations;
```

**الحل:**
```bash
# شغل migrations يدوياً:
DATABASE_URL="<production-url>" npm run migration:run
```

#### 5. TypeScript Build Issues ⚠️

**التحقق:**
```bash
npm run build
```

**الحل:**
```bash
# إذا كان هناك أخطاء TypeScript:
# 1. أصلح الأخطاء
# 2. تأكد من tsconfig.json صحيح
# 3. أعد Build
```

---

## 🔧 خطوات الإصلاح الشاملة

### الخطوة 1: تحقق من Environment Variables

```bash
# في terminal محلي:
vercel env pull .env.vercel

# تحقق من المحتوى:
cat .env.vercel
```

يجب أن يحتوي على:
```env
NODE_ENV="production"
DATABASE_URL="postgresql://..."
JWT_SECRET="..."
```

### الخطوة 2: اختبر Build محلياً

```bash
# نظف
rm -rf node_modules dist

# أعد التثبيت
npm install

# Build
npm run build

# تحقق من النتيجة
ls dist/
```

يجب أن ترى:
```
dist/
  ├── src/
  │   ├── main.js
  │   ├── app.module.js
  │   └── ...
  └── ...
```

### الخطوة 3: اختبر محلياً كـ Production

```bash
# شغل كـ production:
NODE_ENV=production node dist/main.js

# في terminal آخر:
curl http://localhost:4000/api
```

يجب أن يعمل ✅

### الخطوة 4: تأكد من Database Connection

```bash
# في .env محلي:
DATABASE_URL="<your-production-database-url>"

# اختبر:
npm run migration:show
```

يجب أن يعرض migrations بدون أخطاء ✅

### الخطوة 5: Redeploy إلى Vercel

```bash
# Commit التغييرات:
git add .
git commit -m "fix: Vercel configuration and troubleshooting"
git push origin main

# أو يدوياً:
vercel --prod
```

### الخطوة 6: راقب Deployment

في Vercel Dashboard:
1. اذهب إلى Deployments
2. اضغط على آخر deployment
3. راقب:
   - ✅ Build Logs (يجب أن ينجح)
   - ✅ Function Logs (راقب أي أخطاء)

### الخطوة 7: اختبر بعد Deployment

```bash
# انتظر 2-3 دقائق بعد Deployment ينجح
# ثم:

# 1. اختبر Root:
curl https://school-library-backend.vercel.app

# 2. اختبر API:
curl https://school-library-backend.vercel.app/api

# 3. اختبر Login:
curl -X POST https://school-library-backend.vercel.app/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

---

## 📊 Logs Analysis

### Build Logs

**جيد:**
```
✓ Build successful
✓ Compiled TypeScript
✓ Generated 150+ files
```

**سيء:**
```
✗ Build failed
Error: Cannot find module
```

### Runtime Logs

**جيد:**
```
🚀 Server is running
✓ Database connected
```

**سيء:**
```
Error: ECONNREFUSED
Error: Authentication failed
```

---

## 🚨 الأخطاء الشائعة وحلولها

### خطأ: `Cannot find module '@nestjs/core'`

**الحل:**
```bash
# تأكد من dependencies في package.json
npm install
git add package-lock.json
git commit -m "fix: update dependencies"
git push
```

### خطأ: `relation "users" does not exist`

**الحل:**
```bash
# Migrations لم تعمل
DATABASE_URL="<production-url>" npm run migration:run
```

### خطأ: `JWT secret not set`

**الحل:**
```bash
# في Vercel Dashboard:
# Settings → Environment Variables → Add
JWT_SECRET=<64-char-random-hex>
```

### خطأ: `Serverless Function Timeout`

**الحل:**
```json
// في vercel.json أضف:
{
  "functions": {
    "src/main.ts": {
      "maxDuration": 30
    }
  }
}
```

### خطأ: `Memory limit exceeded`

**الحل:**
```json
// في vercel.json أضف:
{
  "functions": {
    "src/main.ts": {
      "memory": 1024
    }
  }
}
```

---

## 🎯 Checklist النهائي

قبل ما تقول "شغال":

- [ ] ✅ Build ينجح محلياً
- [ ] ✅ Environment Variables مضافة في Vercel
- [ ] ✅ Database يتصل بنجاح
- [ ] ✅ Migrations تمت
- [ ] ✅ Vercel Deployment نجح (بدون أخطاء)
- [ ] ✅ Root URL يرد (أي شيء غير 404)
- [ ] ✅ `/api` يفتح (Swagger UI أو API response)
- [ ] ✅ `/auth/login` يعمل ويرجع token
- [ ] ✅ Protected routes تعمل مع token
- [ ] ✅ Database queries تعمل

---

## 🔬 أدوات التشخيص

### 1. Vercel CLI

```bash
# تثبيت:
npm i -g vercel

# تسجيل دخول:
vercel login

# Pull environment:
vercel env pull

# عرض logs:
vercel logs <deployment-url> --follow

# إعادة deploy:
vercel --prod
```

### 2. Database Connection Test

```bash
# أنشئ ملف test.js:
const { Client } = require('pg');
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

client.connect()
  .then(() => {
    console.log('✅ Connected');
    return client.query('SELECT NOW()');
  })
  .then(res => console.log('Time:', res.rows[0]))
  .finally(() => client.end());

# شغل:
node test.js
```

### 3. API Test Script

```bash
# أنشئ ملف test-api.sh:
#!/bin/bash
API="https://school-library-backend.vercel.app"

echo "Testing root..."
curl -s $API | head -n 5

echo -e "\n\nTesting login..."
curl -s -X POST $API/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' | jq

# شغل:
chmod +x test-api.sh
./test-api.sh
```

---

## 📞 للمساعدة

### Vercel Support

- Dashboard: https://vercel.com/dashboard
- Docs: https://vercel.com/docs
- Support: support@vercel.com

### Project Docs

- [DEPLOYMENT.md](DEPLOYMENT.md)
- [SECURITY.md](SECURITY.md)
- [API_REFERENCE.md](API_REFERENCE.md)

---

## 🎁 Pro Tips

1. **استخدم Connection Pooler دائماً** في production
2. **راقب Function logs** في Vercel Dashboard
3. **اختبر محلياً أولاً** قبل Deploy
4. **استخدم Environment Variables** لا hardcode
5. **Enable CORS** للـ frontend

---

**آخر تحديث:** 2024-12-11  
**الحالة:** 🔄 في الإصلاح
