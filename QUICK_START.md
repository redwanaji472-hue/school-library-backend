# البداية السريعة ⚡

دليل مختصر للبدء في 5 دقائق.

## 🎯 الخطوات

### 1. التثبيت

```bash
npm install
```

### 2. إعداد البيئة

```bash
# نسخ ملف الإعدادات
cp .env.example .env

# عدّل الإعدادات (اختياري - الإعدادات الافتراضية تعمل)
```

الإعدادات الافتراضية:
```env
PORT=4000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=1234
DB_NAME=school_library
JWT_SECRET=super-secret-school-library-key
```

### 3. قاعدة البيانات

```bash
# إعداد تلقائي (ينشئ القاعدة + migrations)
npm run setup:db
```

أو يدوياً:
```bash
# إنشاء قاعدة البيانات
psql -U postgres -c "CREATE DATABASE school_library;"

# تشغيل migrations
npm run migration:run
```

### 4. التشغيل

```bash
npm run start:dev
```

✅ السيرفر يعمل على: `http://localhost:4000`

✅ API Docs على: `http://localhost:4000/api`

### 5. تسجيل الدخول

بعد تشغيل `setup:db`، سيكون لديك حساب admin جاهز:

```
Username: admin
Password: admin123
Email: admin@school.edu
```

⚠️ **مهم:** غيّر كلمة المرور مباشرة بعد أول تسجيل دخول!

جرّب تسجيل الدخول:
```bash
POST http://localhost:4000/auth/login
{
  "username": "admin",
  "password": "admin123"
}
```

## 🔧 أوامر مفيدة

```bash
# قاعدة البيانات
npm run migration:show       # حالة migrations
npm run migration:run        # تشغيل migrations
npm run migration:revert     # تراجع

# التطوير
npm run start:dev            # تشغيل مع hot reload
npm run build                # بناء المشروع
npm run lint                 # فحص الكود

# الاختبار
npm run test                 # تشغيل tests
```

## 📊 الجداول المُنشأة

بعد `setup:db` سيكون لديك:

- `roles` - الأدوار
- `users` - المستخدمين
- `classes` - الفصول
- `students` - الطلاب
- `categories` - تصنيفات الكتب
- `books` - الكتب
- `book_copies` - نسخ الكتب
- `loans` - الاستعارات
- `reservations` - الحجوزات
- `reading_activities` - الأنشطة
- `points_transactions` - النقاط
- `audit_logs` - التدقيق

## 🚨 استكشاف الأخطاء

### خطأ: PostgreSQL not running

```bash
# تحقق من الخدمة
# Windows
services.msc → ابحث عن PostgreSQL

# Linux/Mac
sudo systemctl status postgresql
```

### خطأ: Database connection refused

تحقق من:
- PostgreSQL يعمل ✓
- الإعدادات في `.env` صحيحة ✓
- Username/Password صحيحة ✓

### خطأ: Port already in use

```bash
# غيّر PORT في .env
PORT=5000
```

## 📖 للمزيد

- [README الكامل](README.md)
- [دليل الـ Migrations](src/migrations/README.md)
- [دليل النشر](DEPLOYMENT.md)

---

**مستعد للبدء؟ شغّل:** `npm run start:dev` 🚀
