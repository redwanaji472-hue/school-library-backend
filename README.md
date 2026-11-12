# نظام إدارة المكتبة المدرسية الذكي 📚

نظام متكامل لإدارة المكتبة المدرسية مبني بـ **NestJS** و **PostgreSQL** مع نظام نقاط تحفيزي للقراءة.

## 🌟 المميزات

- ✅ إدارة الكتب والنسخ المتعددة
- ✅ نظام الاستعارة والإرجاع
- ✅ الحجوزات والإشعارات
- ✅ نظام النقاط التحفيزي
- ✅ تتبع الأنشطة القرائية
- ✅ إدارة الطلاب والفصول
- ✅ نظام المستخدمين والصلاحيات
- ✅ سجل التدقيق (Audit Logs)
- ✅ API Documentation (Swagger)

## 🚀 البداية السريعة

### المتطلبات

- Node.js (v16+)
- PostgreSQL (v12+)
- npm أو yarn

### التثبيت

```bash
# 1. استنساخ المشروع
git clone <repository-url>
cd school-library-backend

# 2. تثبيت الحزم
npm install

# 3. إعداد ملف البيئة
cp .env.example .env
# عدّل الإعدادات حسب بيئتك

# 4. إعداد قاعدة البيانات (ينشئ القاعدة ويشغل migrations)
npm run setup:db

# 5. تشغيل السيرفر
npm run start:dev
```

السيرفر سيعمل على: `http://localhost:4000`

API Documentation: `http://localhost:4000/api`

### 🔐 تسجيل الدخول الأول

بعد الإعداد، يمكنك تسجيل الدخول بحساب Admin الافتراضي:

```
Username: admin
Password: admin123
```

⚠️ **مهم جداً:** غيّر كلمة المرور فوراً! راجع [دليل إعداد Admin](ADMIN_SETUP.md).

## 📦 Database Migrations

يستخدم المشروع **TypeORM Migrations** لإدارة قاعدة البيانات بشكل آمن.

### الأوامر الأساسية

```bash
# تشغيل الـ migrations
npm run migration:run

# عرض حالة الـ migrations
npm run migration:show

# إنشاء migration جديد تلقائياً
npm run migration:generate src/migrations/MigrationName

# إنشاء migration فارغ
npm run migration:create src/migrations/MigrationName

# التراجع عن آخر migration
npm run migration:revert
```

لمزيد من التفاصيل، راجع:
- [دليل الـ Migrations](src/migrations/README.md)
- [دليل النشر](DEPLOYMENT.md)

## 📖 الأدلة المتاحة

| الدليل | الوصف |
|--------|-------|
| [QUICK_START.md](QUICK_START.md) | بداية سريعة في 5 دقائق |
| [ADMIN_SETUP.md](ADMIN_SETUP.md) | إعداد حساب Admin وتأمينه |
| [DEPLOYMENT.md](DEPLOYMENT.md) | دليل النشر على Vercel + Supabase |
| [SECURITY.md](SECURITY.md) | إرشادات وأفضل ممارسات الأمان |
| [EXAMPLES.md](EXAMPLES.md) | 11 سيناريو عملي مع أمثلة |
| [src/migrations/README.md](src/migrations/README.md) | شرح نظام Migrations |
| [MIGRATIONS_SUMMARY.md](MIGRATIONS_SUMMARY.md) | ملخص شامل للـ Migrations |
| [CHECKLIST.md](CHECKLIST.md) | قائمة تحقق كاملة |

## 🏗️ هيكل المشروع

```
src/
├── modules/
│   ├── users/              # إدارة المستخدمين والصلاحيات
│   ├── students/           # إدارة الطلاب والفصول
│   ├── books/              # إدارة الكتب والتصنيفات
│   ├── loans/              # نظام الاستعارة
│   ├── reservations/       # نظام الحجوزات
│   ├── reading-activities/ # تتبع الأنشطة القرائية
│   ├── points/             # نظام النقاط
│   └── audit-logs/         # سجل التدقيق
├── config/
│   ├── database.config.ts  # إعدادات قاعدة البيانات
│   └── typeorm.config.ts   # إعدادات TypeORM CLI
├── migrations/             # ملفات Database Migrations
└── common/                 # الأدوات والمكونات المشتركة
```

## 🔧 Scripts المتاحة

```bash
# التطوير
npm run start:dev           # تشغيل السيرفر بوضع التطوير
npm run start:debug         # تشغيل مع debugger

# البناء
npm run build               # بناء المشروع
npm run start:prod          # تشغيل النسخة المبنية

# الاختبار
npm run test                # تشغيل الاختبارات
npm run test:watch          # تشغيل الاختبارات بوضع المراقبة
npm run test:cov            # تشغيل مع تقرير التغطية

# الجودة
npm run lint                # فحص الكود
npm run format              # تنسيق الكود

# قاعدة البيانات
npm run setup:db            # إعداد أولي كامل
npm run migration:run       # تشغيل migrations
npm run migration:show      # عرض حالة migrations
```

## 🌐 النشر

### Vercel + Supabase

راجع [دليل النشر الكامل](DEPLOYMENT.md) للتفاصيل.

خطوات سريعة:

1. أنشئ قاعدة بيانات على [Supabase](https://supabase.com)
2. احصل على Connection Pooler URL
3. أضف المتغيرات البيئية في Vercel:
   ```env
   NODE_ENV=production
   DATABASE_URL=your-supabase-url
   JWT_SECRET=your-secret
   ```
4. الـ migrations ستعمل تلقائياً عند Deploy

## 📚 API Documentation

بعد تشغيل السيرفر، افتح: `http://localhost:4000/api`

ستجد:
- جميع الـ endpoints متاحة
- أمثلة على الـ requests
- schemas للـ DTOs
- إمكانية تجربة الـ API مباشرة

## 🔐 المصادقة

يستخدم المشروع **JWT Authentication**:

```typescript
// تسجيل دخول
POST /auth/login
{
  "username": "admin",
  "password": "password"
}

// استخدام Token
Authorization: Bearer <token>
```

## 📝 Environment Variables

```env
# Server
PORT=4000
NODE_ENV=development

# Database (Local)
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=your_password
DB_NAME=school_library

# Database (Production)
DATABASE_URL=postgresql://...

# Security
JWT_SECRET=your-secret-key
```

## 🤝 المساهمة

المساهمات مرحب بها! يرجى:

1. عمل Fork للمشروع
2. إنشاء branch للميزة: `git checkout -b feature/AmazingFeature`
3. Commit التغييرات: `git commit -m 'Add AmazingFeature'`
4. Push للـ branch: `git push origin feature/AmazingFeature`
5. فتح Pull Request

## 📄 الترخيص

هذا المشروع خاص وغير مرخص للاستخدام العام.

## 📧 الدعم

للاستفسارات والدعم، يرجى فتح Issue في المستودع.

---

**بُني بـ ❤️ باستخدام NestJS** 
