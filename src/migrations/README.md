# Database Migrations

هذا المجلد يحتوي على ملفات الـ migrations الخاصة بقاعدة البيانات.

## الأوامر المتاحة

### تشغيل الـ migrations
```bash
npm run migration:run
```
يقوم بتشغيل جميع الـ migrations التي لم يتم تشغيلها بعد.

### إنشاء migration جديد (فارغ)
```bash
npm run migration:create src/migrations/MigrationName
```
ينشئ ملف migration فارغ جاهز للتعديل.

### إنشاء migration تلقائي من التغييرات
```bash
npm run migration:generate src/migrations/MigrationName
```
يقوم بإنشاء migration تلقائياً بناءً على الفرق بين الـ entities وقاعدة البيانات الحالية.

### التراجع عن آخر migration
```bash
npm run migration:revert
```
يتراجع عن آخر migration تم تشغيله.

### عرض حالة الـ migrations
```bash
npm run migration:show
```
يعرض قائمة بجميع الـ migrations وحالتها (تم تشغيلها أم لا).

## الملفات الموجودة

### 1700000000000-InitialSchema.ts
الـ migration الأولي الذي ينشئ جميع الجداول:
- `roles` - الأدوار والصلاحيات
- `users` - المستخدمين
- `classes` - الفصول الدراسية
- `students` - الطلاب
- `categories` - تصنيفات الكتب
- `books` - الكتب
- `book_copies` - نسخ الكتب
- `loans` - الاستعارات
- `reservations` - الحجوزات
- `reading_activities` - الأنشطة القرائية
- `points_transactions` - معاملات النقاط
- `audit_logs` - سجل التدقيق

### 1700000000001-SeedAdminUser.ts
إضافة البيانات الأساسية:
- الأدوار الثلاثة: `admin`, `librarian`, `teacher`
- حساب المدير الافتراضي:
  - **Username:** `admin`
  - **Password:** `admin123`
  - **Email:** `admin@school.edu`
  
⚠️ **مهم جداً:** غيّر كلمة المرور مباشرة بعد أول تسجيل دخول!

## ملاحظات مهمة

1. **في التطوير**: يمكن استخدام `synchronize: true` في الـ config، لكن يُفضل استخدام الـ migrations.
2. **في الإنتاج**: يجب **دائماً** استخدام الـ migrations وتعطيل `synchronize`.
3. قبل عمل deploy، تأكد من تشغيل `npm run migration:run` على السيرفر.
4. احفظ الـ migrations في الـ version control (git).
5. لا تعدل migration بعد تشغيله - أنشئ واحد جديد بدلاً من ذلك.

## خطوات التشغيل الأولى

```bash
# 1. تأكد من وجود قاعدة البيانات
psql -U postgres -c "CREATE DATABASE school_library;"

# 2. شغل الـ migration الأولي
npm run migration:run

# 3. تحقق من النتيجة
npm run migration:show
```
