# دليل النشر والـ Migrations

## جدول المحتويات
1. [إعداد قاعدة البيانات المحلية](#إعداد-قاعدة-البيانات-المحلية)
2. [استخدام الـ Migrations](#استخدام-الـ-migrations)
3. [النشر على Vercel](#النشر-على-vercel)
4. [استكشاف الأخطاء](#استكشاف-الأخطاء)

---

## إعداد قاعدة البيانات المحلية

### 1. إنشاء قاعدة البيانات

```bash
# الدخول إلى PostgreSQL
psql -U postgres

# إنشاء قاعدة البيانات
CREATE DATABASE school_library;

# الخروج من PostgreSQL
\q
```

### 2. إعداد ملف .env

```bash
# نسخ ملف الإعدادات التجريبي
cp .env.example .env
```

عدّل الملف `.env` حسب إعداداتك:
```env
PORT=4000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=your_password
DB_NAME=school_library

JWT_SECRET=your-super-secret-jwt-key
```

### 3. تثبيت الحزم

```bash
npm install
```

---

## استخدام الـ Migrations

### تشغيل الـ Migrations

```bash
# تشغيل جميع الـ migrations
npm run migration:run
```

هذا الأمر سينشئ جميع الجداول:
- ✅ roles
- ✅ users
- ✅ classes
- ✅ students
- ✅ categories
- ✅ books
- ✅ book_copies
- ✅ loans
- ✅ reservations
- ✅ reading_activities
- ✅ points_transactions
- ✅ audit_logs

### عرض حالة الـ Migrations

```bash
npm run migration:show
```

الناتج المتوقع:
```
[X] InitialSchema1700000000000
```

### إنشاء Migration جديد

#### من التغييرات (تلقائي)
```bash
npm run migration:generate src/migrations/AddNewColumn
```

#### فارغ (يدوي)
```bash
npm run migration:create src/migrations/CustomMigration
```

### التراجع عن Migration

```bash
npm run migration:revert
```

---

## النشر على Vercel

### 1. إعداد Supabase Database

1. سجل دخول على [Supabase](https://supabase.com)
2. أنشئ مشروع جديد
3. اذهب إلى **Settings → Database**
4. انسخ الـ **Connection Pooler URL** (Transaction mode)

### 2. إعداد Vercel

1. سجل دخول على [Vercel](https://vercel.com)
2. استورد المشروع من GitHub
3. أضف المتغيرات البيئية:

```env
NODE_ENV=production
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@[YOUR-HOST].supabase.co:5432/postgres?pgbouncer=true
JWT_SECRET=your-production-jwt-secret
```

### 3. إعداد ملف vercel.json

تأكد من وجود ملف `vercel.json`:

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
  ]
}
```

### 4. تشغيل الـ Migrations في الإنتاج

#### الطريقة الأولى: تلقائي عند Deploy

الإعدادات الحالية تشغل الـ migrations تلقائياً في الإنتاج:

```typescript
migrationsRun: isProduction, // في database.config.ts
```

هذا سيشغل:
1. `InitialSchema` - إنشاء جميع الجداول
2. `SeedAdminUser` - إضافة حساب Admin والأدوار

**بيانات تسجيل الدخول الافتراضية:**
- Username: `admin`
- Password: `admin123`
- Email: `admin@school.edu`

⚠️ **مهم جداً:** غيّر كلمة المرور فوراً بعد أول deploy!

#### الطريقة الثانية: يدوياً

```bash
# اتصل بقاعدة بيانات الإنتاج
DATABASE_URL="your-production-url" npm run migration:run
```

### 5. النشر

```bash
# بناء المشروع
npm run build

# النشر
vercel --prod
```

---

## استكشاف الأخطاء

### المشكلة: `relation "roles" does not exist`

**الحل:**
```bash
# تأكد من تشغيل الـ migrations
npm run migration:run

# تحقق من الحالة
npm run migration:show
```

### المشكلة: `connection refused`

**الحل:**
1. تأكد من تشغيل PostgreSQL
2. تحقق من الإعدادات في `.env`
3. تأكد من الـ credentials صحيحة

```bash
# اختبار الاتصال
psql -h localhost -U postgres -d school_library
```

### المشكلة: `synchronize is dangerous in production`

**الحل:**
الإعدادات الحالية آمنة:
- `synchronize: false` في الإنتاج
- `migrationsRun: true` في الإنتاج

### المشكلة: تغييرات الـ Entity لا تظهر

**الحل:**
```bash
# 1. أنشئ migration جديد من التغييرات
npm run migration:generate src/migrations/UpdateSchema

# 2. راجع الملف المُنشأ
# src/migrations/[timestamp]-UpdateSchema.ts

# 3. شغل الـ migration
npm run migration:run
```

### المشكلة: خطأ في Migration

**الحل:**
```bash
# 1. تراجع عن آخر migration
npm run migration:revert

# 2. عدّل ملف الـ migration
# 3. أعد تشغيله
npm run migration:run
```

---

## الأوامر السريعة

```bash
# التطوير
npm install                    # تثبيت الحزم
npm run migration:run          # تشغيل migrations
npm run start:dev              # تشغيل السيرفر

# البناء والاختبار
npm run build                  # بناء المشروع
npm run start:prod             # تشغيل النسخة المبنية

# Migrations
npm run migration:show         # عرض الحالة
npm run migration:generate src/migrations/Name  # إنشاء من تغييرات
npm run migration:create src/migrations/Name    # إنشاء فارغ
npm run migration:revert       # التراجع

# Git
git add .
git commit -m "feat: add migrations"
git push
```

---

## ملاحظات مهمة

### ✅ ما يجب فعله

1. **استخدم Migrations دائماً** في الإنتاج
2. **احفظ الـ Migrations** في Git
3. **راجع الـ Migrations** قبل تشغيلها
4. **اختبر محلياً** قبل النشر
5. **خذ نسخة احتياطية** من قاعدة البيانات قبل migrations كبيرة

### ❌ ما يجب تجنبه

1. **لا تعدل migration** بعد تشغيله
2. **لا تستخدم `synchronize: true`** في الإنتاج
3. **لا تحذف migrations** من Git
4. **لا تشغل migrations يدوياً** على الإنتاج إلا للضرورة
5. **لا تنس** تشغيل migrations بعد pull

---

## الهيكل النهائي

```
school-library-backend/
├── src/
│   ├── migrations/
│   │   ├── 1700000000000-InitialSchema.ts    # الـ schema الأساسي
│   │   └── README.md                          # دليل الـ migrations
│   ├── config/
│   │   ├── database.config.ts                 # إعدادات قاعدة البيانات
│   │   └── typeorm.config.ts                  # إعدادات TypeORM CLI
│   └── modules/
│       └── [...]                              # الوحدات والـ entities
├── .env                                       # الإعدادات المحلية (لا ترفعها على Git)
├── .env.example                               # مثال للإعدادات
├── package.json                               # Scripts الـ migrations
└── DEPLOYMENT.md                              # هذا الملف
```

---

## الدعم

إذا واجهت أي مشاكل:

1. راجع سجلات الأخطاء (logs)
2. تحقق من الإعدادات في `.env`
3. تأكد من تشغيل migrations
4. استخدم `npm run migration:show` للتحقق من الحالة

---

**آخر تحديث:** 2024
**الإصدار:** 1.0.0
