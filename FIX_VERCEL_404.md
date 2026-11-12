# إصلاح 404 على Vercel 🔧

---

## 🐛 المشكلة

```
https://school-library-backend.vercel.app → 404 Not Found
https://school-library-backend.vercel.app/api → 404 Not Found
https://school-library-backend.vercel.app/docs → لا يعمل
```

---

## ✅ الحل السريع

### 1. تحديث vercel.json

تم تحديث الملف ليكون:

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

### 2. أضف Environment Variables

في **Vercel Dashboard → Settings → Environment Variables**:

```env
NODE_ENV=production
DATABASE_URL=postgresql://[USER]:[PASSWORD]@[HOST]/[DB]?pgbouncer=true
JWT_SECRET=<your-64-char-secret>
```

**إنشاء JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 3. أعد النشر

```bash
git add .
git commit -m "fix: Vercel 404 configuration"
git push origin main
```

Vercel سيعيد النشر تلقائياً.

---

## 🧪 الاختبار بعد النشر

### انتظر 2-3 دقائق ثم:

```bash
# 1. اختبر Root
curl https://school-library-backend.vercel.app

# 2. اختبر Login
curl -X POST https://school-library-backend.vercel.app/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

**النتيجة المتوقعة:**
```json
{
  "access_token": "eyJhbGciOiJI...",
  "user": {
    "id": 1,
    "username": "admin",
    "fullName": "مدير النظام",
    "role": "admin"
  }
}
```

---

## 🔍 إذا لم يعمل

### تحقق من Logs

```bash
vercel logs <your-deployment-url>
```

أو في Vercel Dashboard → Deployments → اضغط على آخر deployment → View Logs

### المشاكل الشائعة

| المشكلة | الحل |
|---------|------|
| `Cannot find module` | تأكد من build نجح |
| `Cannot connect to database` | تحقق من DATABASE_URL |
| `Invalid token` | تحقق من JWT_SECRET |
| `Module not found` | شغل `npm install` |

---

## 📋 Checklist

- [ ] ✅ `vercel.json` محدّث
- [ ] ✅ Environment Variables مضافة
- [ ] ✅ Git push تم
- [ ] ✅ Vercel Deployment نجح
- [ ] ✅ Login يعمل
- [ ] ✅ كلمة مرور Admin مُغيّرة

---

## 🎯 الخطوات التالية

بعد ما الـ API تشتغل:

1. **غيّر كلمة مرور Admin فوراً**
2. اختبر باقي الـ endpoints
3. راجع [API_REFERENCE.md](API_REFERENCE.md)
4. استخدم [CURL_EXAMPLES.md](CURL_EXAMPLES.md)

---

## 📞 للمساعدة

- [VERCEL_DEPLOY.md](VERCEL_DEPLOY.md) - دليل كامل
- [DEPLOYMENT.md](DEPLOYMENT.md) - نشر عام
- Vercel Support - support@vercel.com

---

**الحالة:** 🔄 محدّث - يحتاج redeploy  
**التاريخ:** 2024-12-11
