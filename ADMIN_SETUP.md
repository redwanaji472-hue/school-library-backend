# إعداد حساب المدير 👤

دليل سريع لحساب Admin الافتراضي والأمان.

---

## 🎯 حساب المدير الافتراضي

بعد تشغيل `npm run setup:db` أو أول deploy، سيتم إنشاء حساب admin تلقائياً:

### بيانات الدخول

```
Username: admin
Password: admin123
Email:    admin@school.edu
Role:     admin (صلاحيات كاملة)
```

### الأدوار المُنشأة

| الدور | الوصف | الصلاحيات |
|------|-------|-----------|
| `admin` | مدير النظام | جميع الصلاحيات |
| `librarian` | أمين المكتبة | إدارة الكتب والاستعارات |
| `teacher` | معلم | عرض التقارير وتتبع الطلاب |

---

## ⚠️ مهم جداً: الأمان

### 1. غيّر كلمة المرور فوراً

**كلمة المرور الافتراضية (`admin123`) يجب تغييرها مباشرة!**

#### عبر API

```bash
# 1. سجل دخول
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'

# النتيجة:
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

# 2. غير كلمة المرور
curl -X PUT http://localhost:4000/users/me/password \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "oldPassword": "admin123",
    "newPassword": "YourNewStrongPassword123!"
  }'
```

#### عبر Swagger UI

1. افتح `http://localhost:4000/api`
2. اضغط **Authorize**
3. سجل دخول بـ `admin` / `admin123`
4. ابحث عن endpoint `PUT /users/me/password`
5. غيّر كلمة المرور

#### متطلبات كلمة المرور القوية

- ✅ 8 أحرف على الأقل
- ✅ حرف كبير (A-Z)
- ✅ حرف صغير (a-z)
- ✅ رقم (0-9)
- ✅ رمز خاص (!@#$%^&*)

**أمثلة صحيحة:**
```
✅ LibraryAdmin2024!
✅ Secure@School#123
✅ MyStr0ng&Pass2024
```

**أمثلة خاطئة:**
```
❌ admin123        (بسيطة جداً)
❌ password        (شائعة)
❌ 12345678        (أرقام فقط)
```

---

## 🚀 الإعداد الأولي

### خطوة بخطوة

```bash
# 1. تثبيت وإعداد
npm install
cp .env.example .env
npm run setup:db

# الناتج:
# ✅ قاعدة البيانات school_library موجودة
# ✅ الـ Migrations تم تشغيلها بنجاح
#   [X] InitialSchema (12 جدول)
#   [X] SeedAdminUser (Admin + Roles)
# 🎉 الإعداد اكتمل بنجاح!

# 2. تشغيل السيرفر
npm run start:dev

# 3. اختبار تسجيل الدخول
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# 4. غير كلمة المرور فوراً!
```

---

## 🔐 الأمان في الإنتاج

### Checklist قبل Deploy

- [ ] غيّر `JWT_SECRET` في environment variables
- [ ] حدّث كلمة مرور Admin بعد أول deploy
- [ ] فعّل HTTPS (Vercel يوفره تلقائياً)
- [ ] راجع CORS settings
- [ ] فعّل Rate Limiting
- [ ] راجع [SECURITY.md](SECURITY.md) الكامل

### Environment Variables (Vercel)

```env
NODE_ENV=production
DATABASE_URL=postgresql://...@supabase.co:5432/postgres
JWT_SECRET=<سر-قوي-مُولَّد-عشوائياً>
```

إنشاء JWT_SECRET قوي:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## 📝 إدارة المستخدمين

### إنشاء مستخدم جديد

```bash
POST /users
Authorization: Bearer <admin-token>
{
  "username": "librarian1",
  "email": "librarian@school.edu",
  "password": "TempPassword123!",
  "fullName": "أمين المكتبة الأول",
  "roleId": 2  // librarian
}
```

### تعطيل مستخدم

```bash
PATCH /users/:id
Authorization: Bearer <admin-token>
{
  "isActive": false
}
```

### إعادة تعيين كلمة المرور

```bash
PUT /users/:id/reset-password
Authorization: Bearer <admin-token>
{
  "newPassword": "NewTempPassword123!"
}
```

---

## 🔍 التحقق من الإعداد

### 1. قاعدة البيانات

```bash
# تحقق من وجود Admin
psql -d school_library -c "SELECT username, email, \"fullName\" FROM users WHERE username = 'admin';"

# النتيجة المتوقعة:
# username | email              | fullName
# ---------+--------------------+----------
# admin    | admin@school.edu   | مدير النظام
```

### 2. الأدوار

```bash
psql -d school_library -c "SELECT name, description FROM roles ORDER BY id;"

# النتيجة المتوقعة:
# name      | description
# ----------+----------------------------------------
# admin     | مدير النظام - صلاحيات كاملة
# librarian | أمين المكتبة - إدارة الكتب والاستعارات
# teacher   | معلم - عرض التقارير وتتبع الطلاب
```

### 3. الـ Migrations

```bash
npm run migration:show

# النتيجة المتوقعة:
# [X] InitialSchema1700000000000
# [X] SeedAdminUser1700000000001
```

---

## 🆘 استكشاف الأخطاء

### المشكلة: لا أستطيع تسجيل الدخول

**الحل:**
```bash
# 1. تحقق من وجود الحساب
psql -d school_library -c "SELECT * FROM users WHERE username = 'admin';"

# 2. إذا لم يكن موجود، شغل migration مرة أخرى
npm run migration:revert  # تراجع
npm run migration:run     # أعد التشغيل

# 3. أو أعد الإعداد الكامل
npm run setup:db
```

### المشكلة: نسيت كلمة المرور

**الحل:**
```bash
# إعادة تعيين عبر قاعدة البيانات
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('NewPassword123', 10).then(console.log)"

# انسخ الـ hash واستبدله
psql -d school_library -c "UPDATE users SET password = '<hash_من_الأمر_السابق>' WHERE username = 'admin';"
```

### المشكلة: Migration فشل

**الحل:**
```bash
# 1. عرض الحالة
npm run migration:show

# 2. تراجع عن آخر migration
npm run migration:revert

# 3. راجع رسالة الخطأ
# 4. أعد المحاولة
npm run migration:run
```

---

## 📚 التكامل مع النظام

### في الكود

```typescript
// جلب المستخدم الحالي
const user = await this.usersService.findOne(userId);

// التحقق من الصلاحيات
if (user.role.name === 'admin') {
  // صلاحيات admin
}

// Guards للحماية
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
async adminOnlyEndpoint() {
  // فقط admin يمكنه الوصول
}
```

### الأدوار في الـ DTOs

```typescript
export class CreateUserDto {
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsNumber()
  @IsIn([1, 2, 3]) // admin, librarian, teacher
  roleId: number;
}
```

---

## 📖 الخطوات التالية

بعد تأمين حساب Admin:

1. ✅ أنشئ حسابات لأمناء المكتبة والمعلمين
2. ✅ أضف الفصول الدراسية
3. ✅ أضف الطلاب
4. ✅ أضف تصنيفات الكتب
5. ✅ ابدأ إضافة الكتب

---

## 🔗 روابط مفيدة

- [SECURITY.md](SECURITY.md) - دليل الأمان الكامل
- [QUICK_START.md](QUICK_START.md) - البداية السريعة
- [DEPLOYMENT.md](DEPLOYMENT.md) - دليل النشر
- [EXAMPLES.md](EXAMPLES.md) - أمثلة الاستخدام

---

**تذكير:** 🚨
```
⚠️  غيّر كلمة مرور Admin فوراً بعد أول تسجيل دخول!
⚠️  لا تستخدم admin123 في الإنتاج أبداً!
⚠️  راجع SECURITY.md للمزيد من النصائح
```

---

**آخر تحديث:** 2024  
**الحالة:** ✅ جاهز للاستخدام
