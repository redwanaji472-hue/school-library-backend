# ✅ TODO: نشر على Vercel

الخطوات المتبقية لتشغيل الـ API على Vercel.

---

## 🎯 الحالة الحالية

✅ **الكود جاهز 100%**  
✅ **جميع الإصلاحات مطبقة**  
✅ **التوثيق كامل**  
⏳ **يحتاج: Redeploy مع Environment Variables**

---

## 📝 الخطوات المتبقية

### 1️⃣ إضافة Environment Variables

اذهب إلى: https://vercel.com/dashboard

**Steps:**
1. اختر المشروع `school-library-backend`
2. Settings → Environment Variables
3. أضف المتغيرات التالية:

#### المتغيرات الضرورية:

| Variable | Value | ملاحظات |
|----------|-------|---------|
| `NODE_ENV` | `production` | ضروري |
| `DATABASE_URL` | `postgresql://...` | من Supabase |
| `JWT_SECRET` | `<64-char-hex>` | إنشاء جديد |

#### إنشاء JWT_SECRET:

```powershell
# في PowerShell:
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

انسخ الناتج واستخدمه كـ JWT_SECRET.

#### DATABASE_URL من Supabase:

1. اذهب إلى Supabase Dashboard
2. اختر المشروع
3. Settings → Database
4. **Connection String** → انسخ **Connection Pooler**
5. استخدم النوع: **Transaction**

الصيغة:
```
postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true
```

---

### 2️⃣ Commit & Push

```bash
git add .
git commit -m "fix: complete Vercel configuration"
git push origin main
```

Vercel سيبدأ deployment تلقائياً.

---

### 3️⃣ راقب Deployment

في Vercel Dashboard:
1. اذهب إلى **Deployments**
2. اضغط على آخر deployment
3. راقب:
   - **Building** → يجب أن ينجح
   - **Function Logs** → لا أخطاء

**الوقت المتوقع:** 2-3 دقائق

---

### 4️⃣ اختبر الـ API

#### طريقة 1: Script تلقائي (PowerShell)

```powershell
.\scripts\test-vercel-api.ps1
```

#### طريقة 2: يدوياً (PowerShell)

```powershell
# اختبر Login:
$response = Invoke-RestMethod `
  -Uri "https://school-library-backend.vercel.app/auth/login" `
  -Method Post `
  -Body '{"username":"admin","password":"admin123"}' `
  -ContentType "application/json"

$response
```

**النتيجة المتوقعة:**
```json
{
  "access_token": "eyJhbGci...",
  "user": {
    "id": 1,
    "username": "admin",
    "role": "admin"
  }
}
```

#### طريقة 3: المتصفح

افتح: https://school-library-backend.vercel.app/docs

---

### 5️⃣ بعد النجاح

✅ **اختبارات إضافية:**

```powershell
# حفظ Token:
$token = $response.access_token

# اختبر Protected Route:
Invoke-RestMethod `
  -Uri "https://school-library-backend.vercel.app/users" `
  -Method Get `
  -Headers @{Authorization = "Bearer $token"}
```

✅ **غير كلمة مرور Admin:**

```powershell
Invoke-RestMethod `
  -Uri "https://school-library-backend.vercel.app/users/me/password" `
  -Method Put `
  -Headers @{Authorization = "Bearer $token"; "Content-Type" = "application/json"} `
  -Body '{"oldPassword":"admin123","newPassword":"YourNewPassword123!"}'
```

---

## 🔍 إذا لم يعمل

### راجع الأدلة:

| المشكلة | الملف |
|---------|-------|
| 404 Not Found | [FIX_VERCEL_404.md](FIX_VERCEL_404.md) |
| Build Failed | [VERCEL_TROUBLESHOOTING.md](VERCEL_TROUBLESHOOTING.md) |
| Database Error | [VERCEL_TROUBLESHOOTING.md](VERCEL_TROUBLESHOOTING.md) |
| عام | [FIXES_APPLIED.md](FIXES_APPLIED.md) |

### راجع Logs:

```bash
# في terminal:
vercel logs https://school-library-backend.vercel.app --follow
```

أو في **Vercel Dashboard → Deployments → View Logs**

---

## 📊 Checklist

- [ ] Environment Variables مضافة في Vercel
  - [ ] NODE_ENV=production
  - [ ] DATABASE_URL=...
  - [ ] JWT_SECRET=...
- [ ] Git push تم
- [ ] Vercel Deployment نجح
- [ ] Build Logs بدون أخطاء
- [ ] Function Logs بدون أخطاء
- [ ] Login يعمل ✅
- [ ] Protected routes تعمل ✅
- [ ] كلمة مرور Admin مُغيّرة ✅

---

## 🎯 الملفات المفيدة

### للنشر:
- [VERCEL_DEPLOY.md](VERCEL_DEPLOY.md) - دليل كامل
- [FIX_VERCEL_404.md](FIX_VERCEL_404.md) - حل سريع

### للاختبار:
- [API_REFERENCE.md](API_REFERENCE.md) - جميع الـ endpoints
- [CURL_EXAMPLES.md](CURL_EXAMPLES.md) - أمثلة جاهزة
- `scripts/test-vercel-api.ps1` - Script اختبار

### لحل المشاكل:
- [VERCEL_TROUBLESHOOTING.md](VERCEL_TROUBLESHOOTING.md) - شامل
- [FIXES_APPLIED.md](FIXES_APPLIED.md) - ما تم إصلاحه

---

## 🚀 TL;DR (ملخص سريع)

```bash
# 1. أضف Environment Variables في Vercel Dashboard
# 2. Push:
git push origin main

# 3. انتظر 2-3 دقائق
# 4. اختبر:
.\scripts\test-vercel-api.ps1

# 5. إذا نجح → غير كلمة مرور Admin!
```

---

**الحالة:** ⏳ **في انتظار Environment Variables و Redeploy**  
**الوقت المتوقع:** 5-10 دقائق  
**الأولوية:** 🔴 عالية
