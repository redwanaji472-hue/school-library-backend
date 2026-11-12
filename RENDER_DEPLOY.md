# نشر على Render.com (مجاني 100%) 🚀

---

## ✅ لماذا Render؟

- ✅ **مجاني بالكامل** (بدون بطاقة ائتمان)
- ✅ **PostgreSQL مجاني** (مدمج)
- ✅ **NestJS يعمل مباشرة**
- ✅ **SSL مجاني**
- ✅ **Auto-deploy من GitHub**
- ✅ **750 ساعة مجانية شهرياً**

---

## ⚡ الخطوات (10 دقائق)

### 1️⃣ التسجيل

```
1. اذهب إلى: https://render.com
2. اضغط "Get Started"
3. "Sign up with GitHub"
4. Authorize Render
```

**لا يحتاج بطاقة ائتمان!** ✅

---

### 2️⃣ إنشاء PostgreSQL Database

```
1. Dashboard → "New +"
2. اختر "PostgreSQL"
3. الإعدادات:
   - Name: school-library-db
   - Database: school_library
   - User: (تلقائي)
   - Region: اختر الأقرب لك
   - Plan: Free ✅
4. اضغط "Create Database"
```

**انتظر 2-3 دقائق حتى يجهز...**

**احفظ الـ Connection Details:**
```
Internal Database URL: postgresql://...
External Database URL: postgresql://...
```

---

### 3️⃣ إنشاء Web Service

```
1. Dashboard → "New +"
2. اختر "Web Service"
3. "Connect a repository"
4. اختر: school-library-backend
5. اضغط "Connect"
```

**الإعدادات:**

| الحقل | القيمة |
|------|--------|
| **Name** | `school-library-api` |
| **Region** | نفس region الـ database |
| **Branch** | `main` |
| **Root Directory** | `.` (اتركه فارغ) |
| **Runtime** | `Node` |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm run start:prod` |
| **Plan** | **Free** ✅ |

---

### 4️⃣ Environment Variables

في صفحة الإعداد، scroll لـ **Environment Variables**:

اضغط **Add Environment Variable** لكل واحد:

#### المتغير 1: NODE_ENV
```
Key: NODE_ENV
Value: production
```

#### المتغير 2: DATABASE_URL
```
Key: DATABASE_URL
Value: <الصق Internal Database URL من الخطوة 2>
```

**مثال:**
```
postgresql://school_library_user:xxxxx@dpg-xxxxx-a.oregon-postgres.render.com/school_library_xxxx
```

#### المتغير 3: JWT_SECRET

**أولاً، ولّد secret:**
```powershell
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

**ثم أضفه:**
```
Key: JWT_SECRET
Value: <الصق الـ secret المولّد>
```

---

### 5️⃣ اضغط Create Web Service

Render سيبدأ:
1. ✅ Clone من GitHub
2. ✅ Install dependencies
3. ✅ Build المشروع
4. ✅ Deploy

**الوقت: 5-10 دقائق**

---

### 6️⃣ Run Migrations

بعد ما الـ deploy ينجح:

#### الطريقة 1: من Render Shell

```
1. Dashboard → Web Service → Shell
2. في Terminal اكتب:
   npm run migration:run
3. اضغط Enter
```

#### الطريقة 2: تلقائي عند كل deploy

عدّل `package.json`:

```json
{
  "scripts": {
    "start:prod": "npm run migration:run && node dist/main"
  }
}
```

**Commit و Push:**
```bash
git add package.json
git commit -m "feat: auto-run migrations on deploy"
git push origin main
```

Render سيعيد deploy تلقائياً.

---

### 7️⃣ احصل على URL

بعد Deploy ينجح:

```
Dashboard → Web Service
ستجد URL مثل:
https://school-library-api.onrender.com
```

---

## 🧪 الاختبار

```powershell
# استبدل بالـ URL الخاص بك
$API = "https://school-library-api.onrender.com"

# Test Root
Invoke-WebRequest -Uri $API

# Test Login
Invoke-RestMethod -Uri "$API/auth/login" `
  -Method Post `
  -Body '{"username":"admin","password":"admin123"}' `
  -ContentType "application/json"
```

**يجب أن يعمل!** ✅

---

## 📊 مميزات Render Free Plan

- ✅ **750 ساعة مجانية شهرياً** (كافية للـ development)
- ✅ **PostgreSQL 1GB مجاني**
- ✅ **SSL Certificate مجاني**
- ✅ **Auto-deploy من Git**
- ✅ **Custom domains مجاني**
- ⚠️ **Sleep after 15 min inactivity** (يستيقظ تلقائياً عند الطلب)

---

## 💡 نصائح

### منع Sleep (Keep-Alive)

إذا تريد الـ API تبقى مستيقظة:

استخدم **UptimeRobot** (مجاني):
```
1. https://uptimerobot.com
2. Add New Monitor
3. URL: https://your-app.onrender.com/api
4. Interval: 5 minutes
```

هذا سيرسل request كل 5 دقائق → الـ app ما تنام ✅

---

### Logs

```
Dashboard → Web Service → Logs
```

### Redeploy

```
Dashboard → Web Service → Manual Deploy → Deploy latest commit
```

### Database Access

```
Dashboard → PostgreSQL → Connect
أو استخدم أي PostgreSQL client مع External URL
```

---

## 🔧 استكشاف الأخطاء

### Build Failed

**راجع Logs:**
```
Dashboard → Web Service → Events → Build Logs
```

**الحل الشائع:**
```bash
# محلياً تأكد:
npm install
npm run build

# إذا نجح، push:
git add .
git commit -m "fix: build"
git push
```

### Migration Failed

**شغلها يدوياً:**
```
Dashboard → Web Service → Shell
npm run migration:run
```

### Database Connection Error

**تحقق من DATABASE_URL:**
```
Environment Variables → DATABASE_URL
يجب أن يطابق الـ Internal URL من PostgreSQL service
```

---

## ✅ Checklist

- [ ] سجلت في Render.com (مجاني)
- [ ] أنشأت PostgreSQL database
- [ ] حفظت DATABASE_URL
- [ ] أنشأت Web Service
- [ ] أضفت Environment Variables (3)
- [ ] Deploy نجح
- [ ] شغلت Migrations
- [ ] حصلت على URL
- [ ] اختبرت Login ✅
- [ ] غيرت كلمة مرور Admin

---

## 🎉 النتيجة

```
✅ API: https://your-app.onrender.com
✅ Swagger: https://your-app.onrender.com/docs
✅ Database: PostgreSQL مجاني
✅ SSL: تلقائي
✅ Auto-deploy: من GitHub
✅ التكلفة: $0 (مجاني 100%)
```

---

## 📞 الدعم

- Render Docs: https://render.com/docs
- Render Community: https://community.render.com

---

**الوقت: 10 دقائق**  
**التكلفة: $0 (مجاني)**  
**السهولة: ⭐⭐⭐⭐⭐**  
**التوصية: 🌟🌟🌟🌟🌟**

---

**ابدأ الآن:** https://render.com 🚀
