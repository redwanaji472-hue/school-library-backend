# دليل النشر على Vercel 🚀

دليل خطوة بخطوة لنشر المشروع على Vercel.

---

## ⚠️ المشكلة الحالية

الـ API على `https://school-library-backend.vercel.app` تعطي 404.

**السبب المحتمل:**
1. المشروع لم يُنشر بعد
2. خطأ في `vercel.json` configuration
3. Migrations لم تعمل
4. Environment variables ناقصة

---

## 🔧 الحل: إعادة النشر الصحيح

### 1. تحقق من Environment Variables

في Vercel Dashboard → Settings → Environment Variables:

```env
NODE_ENV=production
DATABASE_URL=postgresql://user:password@host:5432/db?pgbouncer=true
JWT_SECRET=<strong-random-secret-64-chars>
```

**إنشاء JWT_SECRET قوي:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

### 2. تحديث vercel.json

تم تحديث `vercel.json` ليكون:

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
      "dest": "src/main.ts",
      "methods": ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
    }
  ]
}
```

---

### 3. تحديث package.json

تأكد من وجود build script:

```json
{
  "scripts": {
    "build": "nest build",
    "start:prod": "node dist/main"
  }
}
```

---

### 4. إعادة النشر

```bash
# 1. Commit التغييرات
git add .
git commit -m "fix: update Vercel configuration"

# 2. Push إلى GitHub
git push origin main

# 3. Vercel سيعيد النشر تلقائياً
```

أو يدوياً:

```bash
vercel --prod
```

---

## 🧪 اختبار بعد النشر

### 1. اختبر الـ Root

```bash
curl https://school-library-backend.vercel.app
```

يجب أن يرجع شيء (مثل "Hello World" أو redirect)

### 2. اختبر Swagger

```bash
curl https://school-library-backend.vercel.app/api
```

يجب أن يفتح Swagger UI

### 3. اختبر Login

```bash
curl -X POST https://school-library-backend.vercel.app/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

يجب أن تحصل على token ✅

---

## 🔍 استكشاف الأخطاء

### الخطأ: 404 Not Found

**الأسباب المحتملة:**
1. Routes configuration خاطئ
2. Build فشل
3. Main file path خاطئ

**الحل:**
- راجع Vercel Deployment Logs
- تحقق من `vercel.json`
- تأكد من `src/main.ts` موجود

### الخطأ: 500 Internal Server Error

**الأسباب المحتملة:**
1. Database connection فشل
2. Environment variables ناقصة
3. Migrations لم تعمل

**الحل:**
```bash
# 1. راجع Vercel Logs
vercel logs <deployment-url>

# 2. تحقق من DATABASE_URL
# 3. شغل migrations يدوياً
DATABASE_URL="production-url" npm run migration:run
```

### الخطأ: Cannot connect to database

**الحل:**
1. تحقق من DATABASE_URL في Vercel
2. تأكد من استخدام Connection Pooler URL
3. تحقق من أن IP مسموح في Supabase

---

## 📊 Vercel Configuration الكاملة

### vercel.json (الحالي)

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
      "dest": "src/main.ts",
      "methods": ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
    }
  ]
}
```

### Environment Variables

في Vercel Dashboard:

| Variable | Value | الوصف |
|----------|-------|-------|
| `NODE_ENV` | `production` | بيئة الإنتاج |
| `DATABASE_URL` | `postgresql://...` | Supabase URL |
| `JWT_SECRET` | `<64-char-hex>` | JWT secret |

---

## 🔄 خطوات إعادة النشر الكاملة

### الطريقة 1: من GitHub

```bash
# 1. تأكد من أن التغييرات محفوظة
git status

# 2. Commit
git add .
git commit -m "fix: Vercel deployment configuration"

# 3. Push
git push origin main

# 4. Vercel سيعيد النشر تلقائياً
# راقب في Vercel Dashboard
```

### الطريقة 2: Vercel CLI

```bash
# 1. تثبيت Vercel CLI
npm i -g vercel

# 2. تسجيل الدخول
vercel login

# 3. Deploy
vercel --prod

# 4. اتبع التعليمات
```

---

## ✅ Checklist قبل النشر

- [ ] `vercel.json` صحيح
- [ ] Environment Variables مضافة في Vercel
- [ ] Database موجودة وتعمل
- [ ] Migrations جاهزة
- [ ] Build ينجح محلياً (`npm run build`)
- [ ] Tests تمر (إذا موجودة)
- [ ] JWT_SECRET قوي
- [ ] CORS مُعدّ بشكل صحيح

---

## 🎯 بعد النشر الناجح

### اختبارات ضرورية

```bash
# 1. Health Check
curl https://school-library-backend.vercel.app

# 2. API Docs
curl https://school-library-backend.vercel.app/api

# 3. Login
curl -X POST https://school-library-backend.vercel.app/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# 4. Protected Route
curl https://school-library-backend.vercel.app/users \
  -H "Authorization: Bearer <token>"
```

### الخطوات التالية

1. ✅ غيّر كلمة مرور Admin فوراً
2. ✅ اختبر جميع الـ endpoints
3. ✅ راقب Logs في Vercel
4. ✅ أضف monitoring (optional)

---

## 🚨 أمان الإنتاج

### قبل الاستخدام الفعلي

- [ ] **غيّر كلمة مرور Admin**
- [ ] حدّث JWT_SECRET
- [ ] فعّل HTTPS only
- [ ] راجع CORS settings
- [ ] أضف Rate Limiting
- [ ] راجع [SECURITY.md](SECURITY.md)

---

## 📞 الدعم

### Logs

```bash
# عرض logs الأخيرة
vercel logs <deployment-url> --follow
```

### Redeploy

```bash
# إعادة النشر بدون تغييرات
vercel --prod --force
```

### Rollback

في Vercel Dashboard:
1. اذهب إلى Deployments
2. اختر deployment قديم
3. اضغط "Promote to Production"

---

## 📚 موارد إضافية

- [Vercel Documentation](https://vercel.com/docs)
- [NestJS Vercel Guide](https://docs.nestjs.com/faq/serverless)
- [Supabase Connection Pooling](https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pooler)

---

**آخر تحديث:** 2024-12-11  
**الحالة:** 🔄 يحتاج إعادة نشر
