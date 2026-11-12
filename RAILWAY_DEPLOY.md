# نشر على Railway.app 🚂

دليل سريع ومباشر للنشر على Railway.

---

## 🎯 لماذا Railway؟

✅ **يعمل مع NestJS بدون تعديلات**  
✅ **PostgreSQL مجاني مدمج**  
✅ **Auto-deploy من GitHub**  
✅ **Migrations تلقائية**  
✅ **أسهل من Vercel للـ NestJS**

---

## ⚡ الخطوات السريعة (5 دقائق)

### 1️⃣ التسجيل

```
1. اذهب إلى: https://railway.app
2. اضغط "Start a New Project"
3. "Login with GitHub"
4. Authorize Railway
```

### 2️⃣ إنشاء Project

```
1. Dashboard → "New Project"
2. "Deploy from GitHub repo"
3. اختر المشروع: school-library-backend
4. اضغط "Deploy Now"
```

Railway سيبدأ build تلقائياً!

### 3️⃣ إضافة Database

```
1. في نفس Project → اضغط "+ New"
2. اختر "Database"
3. اختر "Add PostgreSQL"
4. Railway سيعطيك DATABASE_URL تلقائياً ✅
```

### 4️⃣ تعديل Environment Variables

```
1. اضغط على الـ service (school-library-backend)
2. اذهب إلى "Variables"
3. اضغط "RAW Editor"
4. أضف:
```

```env
NODE_ENV=production
JWT_SECRET=<your-64-char-secret>
```

**ملاحظة:** `DATABASE_URL` موجود تلقائياً من PostgreSQL ✅

**لإنشاء JWT_SECRET:**
```powershell
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 5️⃣ تشغيل Migrations

بعد أول deploy:

```
1. في Project → اضغط على PostgreSQL service
2. اذهب إلى "Data" tab
3. أو استخدم Railway CLI:
```

```bash
# تثبيت Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link project
railway link

# Run migrations
railway run npm run migration:run
```

**أو** عدّل `package.json` ليشغل migrations تلقائياً:

```json
{
  "scripts": {
    "start:prod": "npm run migration:run && node dist/main"
  }
}
```

### 6️⃣ احصل على URL

```
1. في الـ service → Settings
2. ابحث عن "Domains"
3. اضغط "Generate Domain"
4. احصل على URL: https://xxx.up.railway.app
```

---

## 🧪 الاختبار

```powershell
# استبدل بالـ URL الجديد
$API = "https://your-app.up.railway.app"

# Test Login
Invoke-RestMethod -Uri "$API/auth/login" `
  -Method Post `
  -Body '{"username":"admin","password":"admin123"}' `
  -ContentType "application/json"
```

**يجب أن يعمل!** ✅

---

## 📊 Railway Dashboard

### ما ستراه:

**Services:**
```
📦 school-library-backend (Node.js)
   Status: Active ✅
   URL: https://xxx.up.railway.app
   
🗄️ PostgreSQL
   Status: Active ✅
   DATABASE_URL: postgresql://...
```

**Deployments:**
```
✅ main - Deployed 2 minutes ago
   Build: Success
   Deploy: Success
```

**Variables:**
```
✅ NODE_ENV=production
✅ JWT_SECRET=***
✅ DATABASE_URL=*** (auto)
```

---

## 🔧 Settings المهمة

### في Service Settings:

**Build Command:**
```
npm run build
```

**Start Command:**
```
npm run start:prod
```

أو مع migrations:
```
npm run migration:run && npm run start:prod
```

**Root Directory:**
```
/
```

**Watch Paths:**
```
/
```

---

## 🔄 Auto-Deploy

Railway يعمل auto-deploy من GitHub:

```
1. عدّل الكود
2. git push origin main
3. Railway يبني و ينشر تلقائياً ✅
```

---

## 📝 إضافة Build Command للـ Migrations

في `package.json` أضف:

```json
{
  "scripts": {
    "postinstall": "npm run build",
    "start:prod": "npm run migration:run && node dist/main",
    "railway:deploy": "npm run build && npm run migration:run && npm run start:prod"
  }
}
```

في Railway Settings:
- **Build Command:** `npm install`
- **Start Command:** `npm run railway:deploy`

---

## 🎯 Checklist

- [ ] سجلت في Railway ✅
- [ ] أنشأت Project من GitHub ✅
- [ ] أضفت PostgreSQL database ✅
- [ ] أضفت Environment Variables ✅
- [ ] شغلت Migrations ✅
- [ ] حصلت على Domain/URL ✅
- [ ] اختبرت Login ✅
- [ ] غيرت كلمة مرور Admin ✅

---

## 💡 نصائح

### Logs
```
Dashboard → Service → Deployments → View Logs
```

### Database Access
```
Dashboard → PostgreSQL → Data
أو
Dashboard → PostgreSQL → Connect
```

### Redeploy
```
Dashboard → Service → Deployments → 
⋯ → Redeploy
```

### Environment Variables
```
أي تغيير في Variables يحتاج redeploy
```

---

## 🆘 المشاكل الشائعة

### Build Failed

**السبب:** Dependencies ناقصة

**الحل:**
```bash
# محلياً:
npm install
git add package-lock.json
git commit -m "fix: update dependencies"
git push
```

### Migration Failed

**السبب:** DATABASE_URL غير صحيح

**الحل:**
```
1. تحقق من Variables
2. تأكد من PostgreSQL service يعمل
3. أعد deploy
```

### Can't Connect to Database

**السبب:** Connection من outside Railway

**الحل:**
استخدم Railway CLI:
```bash
railway run npm run migration:run
```

---

## 📊 التكلفة

### الخطة المجانية:
- ✅ $5 credit شهرياً
- ✅ كافية للـ development
- ✅ 500 ساعة execution
- ✅ PostgreSQL 1GB

### للإنتاج:
- $5/month للـ PostgreSQL
- Pay-as-you-go للـ usage

---

## 🔗 روابط مفيدة

- Railway Dashboard: https://railway.app/dashboard
- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway

---

## 🎉 النتيجة

بعد النشر على Railway:

```
✅ API يعمل: https://xxx.up.railway.app
✅ Swagger: https://xxx.up.railway.app/docs
✅ Login: يعمل
✅ Database: متصل
✅ Migrations: تلقائية
✅ Auto-deploy: من GitHub
```

---

**الوقت الإجمالي: 5-10 دقائق** ⏱️  
**السهولة: ⭐⭐⭐⭐⭐**  
**التوصية: 🌟🌟🌟🌟🌟**

---

**جرب Railway الآن وقلي النتيجة!** 🚀
