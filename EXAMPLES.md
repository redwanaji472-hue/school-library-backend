# أمثلة الاستخدام 📚

أمثلة عملية لاستخدام نظام الـ Migrations.

---

## السيناريو 1: إعداد المشروع لأول مرة 🆕

```bash
# 1. استنساخ المشروع
git clone <repo-url>
cd school-library-backend

# 2. تثبيت الحزم
npm install

# 3. إعداد البيئة
cp .env.example .env
# عدّل .env حسب بيئتك

# 4. إعداد قاعدة البيانات تلقائياً
npm run setup:db

# الناتج المتوقع:
# ✅ ملف .env موجود
# ✅ الاتصال بـ PostgreSQL نجح
# ✅ قاعدة البيانات school_library موجودة
# ✅ الـ Migrations تم تشغيلها بنجاح
# 🎉 الإعداد اكتمل بنجاح!

# 5. تشغيل السيرفر
npm run start:dev

# افتح: http://localhost:4000/api
```

---

## السيناريو 2: إضافة عمود جديد لجدول موجود 📝

### المثال: إضافة `phoneNumber` لجدول `users`

```bash
# 1. عدّل الـ Entity
```

```typescript
// src/modules/users/entities/user.entity.ts
@Entity('users')
export class User {
  // ... الحقول الموجودة
  
  @Column({ nullable: true })
  phoneNumber: string; // حقل جديد
}
```

```bash
# 2. أنشئ migration تلقائياً من التغيير
npm run migration:generate src/migrations/AddPhoneNumberToUsers

# 3. ستجد ملف جديد في src/migrations/
# مثال: 1700123456789-AddPhoneNumberToUsers.ts

# 4. راجع المحتوى
cat src/migrations/1700123456789-AddPhoneNumberToUsers.ts
```

```typescript
// المحتوى المُنشأ تلقائياً:
public async up(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.query(`
    ALTER TABLE "users" 
    ADD "phoneNumber" character varying
  `);
}

public async down(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.query(`
    ALTER TABLE "users" 
    DROP COLUMN "phoneNumber"
  `);
}
```

```bash
# 5. شغل الـ migration
npm run migration:run

# 6. تحقق من النتيجة
npm run migration:show
# [X] InitialSchema1700000000000
# [X] AddPhoneNumberToUsers1700123456789

# 7. اختبر في psql
psql -d school_library -c "\d users"
# يجب أن يظهر العمود phoneNumber
```

---

## السيناريو 3: إنشاء جدول جديد 🆕

### المثال: إضافة جدول `notifications`

```bash
# 1. أنشئ الـ Entity
```

```typescript
// src/modules/notifications/entities/notification.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  message: string;

  @Column({ default: false })
  isRead: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number;
}
```

```bash
# 2. أنشئ migration
npm run migration:generate src/migrations/CreateNotifications

# 3. راجع الملف المُنشأ وعدّله إذا لزم الأمر

# 4. شغل الـ migration
npm run migration:run

# 5. تحقق
psql -d school_library -c "\dt"
# يجب أن يظهر جدول notifications
```

---

## السيناريو 4: تعديل بيانات موجودة 📊

### المثال: تحديث قيمة افتراضية

```bash
# 1. أنشئ migration فارغ (يدوي)
npm run migration:create src/migrations/UpdateDefaultPoints

# 2. عدّل الملف المُنشأ
```

```typescript
// src/migrations/1700234567890-UpdateDefaultPoints.ts
import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateDefaultPoints1700234567890 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // تحديث النقاط الافتراضية لجميع الكتب
    await queryRunner.query(`
      UPDATE books 
      SET "pointsValue" = 10 
      WHERE "pointsValue" < 10
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // التراجع: إرجاع القيمة الأصلية
    await queryRunner.query(`
      UPDATE books 
      SET "pointsValue" = 5 
      WHERE "pointsValue" = 10
    `);
  }
}
```

```bash
# 3. شغل الـ migration
npm run migration:run

# 4. تحقق من البيانات
psql -d school_library -c "SELECT title, pointsValue FROM books LIMIT 5;"
```

---

## السيناريو 5: خطأ في Migration - كيف أتراجع؟ 🔄

```bash
# لنفترض أنك شغلت migration خاطئ

# 1. عرض الحالة
npm run migration:show
# [X] InitialSchema1700000000000
# [X] AddPhoneNumber1700123456789
# [X] WrongMigration1700234567890  ← هذا خاطئ

# 2. التراجع عن آخر migration
npm run migration:revert
# سيشغل down() method للـ WrongMigration

# 3. تحقق من الحالة
npm run migration:show
# [X] InitialSchema1700000000000
# [X] AddPhoneNumber1700123456789
# [ ] WrongMigration1700234567890  ← لم يعد مُشغَّل

# 4. عدّل الـ migration أو احذفه

# 5. أعد التشغيل (إذا عدّلته)
npm run migration:run
```

---

## السيناريو 6: النشر على الإنتاج 🚀

### استخدام Vercel + Supabase

```bash
# 1. المحلي: تأكد من أن كل شيء يعمل
npm run build
npm run migration:show

# 2. Supabase: أنشئ المشروع
# - سجل دخول على https://supabase.com
# - New Project
# - احصل على Connection Pooler URL

# 3. Vercel: أضف المتغيرات البيئية
# Settings → Environment Variables:
NODE_ENV=production
DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST].supabase.co:5432/postgres
JWT_SECRET=your-production-secret

# 4. Deploy
git add .
git commit -m "feat: add migrations system"
git push

# 5. Vercel سيبني ويشغل الـ migrations تلقائياً
# (بفضل migrationsRun: true في الإنتاج)

# 6. تحقق من السجلات (Vercel Dashboard → Logs)
# يجب أن ترى:
# ✓ migrations run successfully

# 7. اختبر الـ API
curl https://your-app.vercel.app/api
```

---

## السيناريو 7: عمل Pull من Git وتحديث القاعدة 🔄

```bash
# زميلك أضاف migration جديد

# 1. Pull التحديثات
git pull origin main

# 2. تحديث الحزم (إذا تغيرت)
npm install

# 3. عرض الـ migrations الجديدة
npm run migration:show
# [X] InitialSchema1700000000000
# [ ] NewFeature1700345678901  ← جديد ولم يُشغَّل

# 4. تشغيل الـ migrations الجديدة
npm run migration:run

# 5. تحقق
npm run migration:show
# [X] InitialSchema1700000000000
# [X] NewFeature1700345678901  ← الآن مُشغَّل ✓

# 6. تشغيل السيرفر
npm run start:dev
```

---

## السيناريو 8: إضافة بيانات تجريبية (Seeding) 🌱

```bash
# 1. بعد تشغيل الـ migrations
npm run migration:run

# 2. تشغيل seed script
psql -d school_library -f scripts/seed-data.sql

# الناتج المتوقع:
# INSERT 0 3  (roles)
# INSERT 0 3  (users)
# INSERT 0 4  (classes)
# INSERT 0 3  (students)
# INSERT 0 5  (categories)
# INSERT 0 3  (books)
# INSERT 0 9  (book_copies)

# 3. تحقق من البيانات
psql -d school_library -c "SELECT * FROM roles;"
# يجب أن ترى: admin, librarian, teacher
```

---

## السيناريو 9: اختبار الـ Migrations في بيئة منفصلة 🧪

```bash
# 1. أنشئ قاعدة بيانات للاختبار
psql -U postgres -c "CREATE DATABASE school_library_test;"

# 2. عدّل .env مؤقتاً
DB_NAME=school_library_test

# 3. شغل الـ migrations
npm run migration:run

# 4. اختبر
npm run test

# 5. احذف قاعدة البيانات
psql -U postgres -c "DROP DATABASE school_library_test;"

# 6. أرجع .env للقيمة الأصلية
DB_NAME=school_library
```

---

## السيناريو 10: البحث عن مشكلة في Migration 🔍

```bash
# لنفترض أن migration فشل

# 1. عرض آخر migration
npm run migration:show

# 2. الاتصال بالقاعدة
psql -d school_library

# 3. تحقق من الجدول migrations
SELECT * FROM migrations ORDER BY timestamp DESC LIMIT 1;

# 4. تحقق من السجلات (logs)
npm run migration:run 2>&1 | tee migration-debug.log

# 5. إذا لزم الأمر، تراجع وعدّل
npm run migration:revert
# عدّل ملف الـ migration
npm run migration:run

# 6. اختبر مرة أخرى
npm run start:dev
```

---

## السيناريو 11: تغيير كلمة مرور Admin الافتراضية 🔐

بعد أول deploy أو setup، يجب تغيير كلمة المرور:

### الطريقة 1: عبر API

```bash
# 1. سجل دخول بالحساب الافتراضي
POST http://localhost:4000/auth/login
{
  "username": "admin",
  "password": "admin123"
}

# النتيجة:
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

# 2. غير كلمة المرور
PUT http://localhost:4000/users/me/password
Authorization: Bearer <token>
{
  "oldPassword": "admin123",
  "newPassword": "YourStrongPassword123!"
}
```

### الطريقة 2: عبر قاعدة البيانات (للطوارئ)

```bash
# 1. أنشئ hash جديد لكلمة المرور
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('NewPassword123', 10).then(console.log)"

# 2. حدّث في قاعدة البيانات
psql -d school_library -c "UPDATE users SET password = '<hash_من_الخطوة_السابقة>' WHERE username = 'admin';"
```

### الطريقة 3: إنشاء migration لتغيير كلمة المرور

```typescript
// src/migrations/[timestamp]-UpdateAdminPassword.ts
import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';

export class UpdateAdminPassword1700456789012 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const newPassword = await bcrypt.hash('NewSecurePassword123!', 10);
    await queryRunner.query(`
      UPDATE users 
      SET password = $1, "updatedAt" = NOW()
      WHERE username = 'admin'
    `, [newPassword]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // لا نريد إرجاع كلمة المرور القديمة
    console.log('لا يمكن التراجع عن تغيير كلمة المرور');
  }
}
```

⚠️ **أمان:** لا تحفظ كلمات المرور في Git!

---

## نصائح عامة 💡

### ✅ أفضل الممارسات

1. **دائماً راجع** الـ migration قبل تشغيله
2. **اختبر محلياً** قبل النشر
3. **خذ backup** قبل migrations كبيرة في الإنتاج
4. **استخدم أسماء واضحة** للـ migrations
5. **وثّق التغييرات** في الـ commit message

### ❌ ما يجب تجنبه

1. **لا تعدل migration** بعد تشغيله ونشره
2. **لا تحذف migrations** من Git
3. **لا تشغل migrations يدوياً** على الإنتاج مباشرة
4. **لا تنس** `down()` method للتراجع
5. **لا تخلط** بين `synchronize: true` و migrations

---

## المرجع السريع 📋

```bash
# إعداد
npm run setup:db                        # كل شيء مرة واحدة

# عرض
npm run migration:show                  # حالة migrations

# تشغيل
npm run migration:run                   # تشغيل جميع الجديدة

# إنشاء
npm run migration:generate src/migrations/Name   # من تغييرات
npm run migration:create src/migrations/Name     # فارغ

# تراجع
npm run migration:revert                # آخر migration

# قاعدة البيانات
psql -d school_library -c "\dt"         # عرض الجداول
psql -d school_library -f file.sql      # تشغيل SQL
```

---

**هل تحتاج مثال آخر؟** راجع [DEPLOYMENT.md](DEPLOYMENT.md) أو [README.md](README.md)
