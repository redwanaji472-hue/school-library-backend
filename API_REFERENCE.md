# مرجع API 📡

دليل شامل لجميع endpoints المتاحة في النظام.

---

## 🔐 Authentication

### POST /auth/login

تسجيل الدخول والحصول على JWT token.

**Request:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "fullName": "مدير النظام",
    "role": "admin"
  }
}
```

**Errors:**
- `401` - Invalid credentials
- `500` - Server error

---

### POST /auth/register

تسجيل مستخدم جديد (يتطلب صلاحيات admin).

**Request:**
```json
{
  "username": "librarian1",
  "password": "SecurePass123!",
  "fullName": "أمين المكتبة الأول",
  "roleId": 2,
  "isActive": true
}
```

**Response (201):**
```json
{
  "id": 2,
  "username": "librarian1",
  "fullName": "أمين المكتبة الأول"
}
```

---

## 👥 Users

### GET /users

الحصول على قائمة جميع المستخدمين.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "id": 1,
    "username": "admin",
    "fullName": "مدير النظام",
    "isActive": true,
    "role": {
      "id": 1,
      "name": "admin"
    }
  }
]
```

---

### GET /users/:id

الحصول على مستخدم محدد.

**Response (200):**
```json
{
  "id": 1,
  "username": "admin",
  "fullName": "مدير النظام",
  "isActive": true,
  "role": {
    "id": 1,
    "name": "admin",
    "description": "مدير النظام - صلاحيات كاملة"
  }
}
```

**Errors:**
- `404` - User not found

---

### POST /users

إنشاء مستخدم جديد (admin فقط).

**Request:**
```json
{
  "username": "teacher1",
  "password": "TeacherPass123!",
  "fullName": "المعلم الأول",
  "roleId": 3,
  "isActive": true
}
```

---

### PATCH /users/:id

تحديث مستخدم.

**Request:**
```json
{
  "fullName": "المعلم الأول المحدّث",
  "isActive": false
}
```

---

### DELETE /users/:id

حذف مستخدم.

**Response (200):**
```json
{
  "message": "User deleted successfully"
}
```

---

## 📚 Books

### GET /books

الحصول على قائمة الكتب.

**Query Parameters:**
- `page` (optional) - رقم الصفحة
- `limit` (optional) - عدد النتائج
- `search` (optional) - بحث في العنوان أو المؤلف
- `categoryId` (optional) - تصفية حسب التصنيف

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "isbn": "978-1234567890",
      "title": "مغامرات في الغابة",
      "author": "محمد الكاتب",
      "publisher": "دار النشر",
      "publishedYear": 2020,
      "language": "ar",
      "pageCount": 120,
      "readingLevel": "beginner",
      "pointsValue": 10,
      "totalCopies": 3,
      "availableCopies": 3,
      "isActive": true,
      "category": {
        "id": 1,
        "name": "قصص أطفال"
      }
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10
}
```

---

### GET /books/:id

الحصول على تفاصيل كتاب.

**Response (200):**
```json
{
  "id": 1,
  "isbn": "978-1234567890",
  "title": "مغامرات في الغابة",
  "author": "محمد الكاتب",
  "summary": "قصة مشوقة عن مغامرات في الغابة",
  "coverImage": null,
  "ageRange": "6-9",
  "copies": [
    {
      "id": 1,
      "copyNumber": "C001",
      "barcode": "BAR001",
      "condition": "new",
      "status": "available",
      "location": "main-shelf"
    }
  ]
}
```

---

### POST /books

إضافة كتاب جديد (librarian أو admin).

**Request:**
```json
{
  "isbn": "978-9876543210",
  "title": "كتاب جديد",
  "author": "الكاتب",
  "publisher": "دار النشر",
  "publishedYear": 2024,
  "language": "ar",
  "pageCount": 150,
  "summary": "ملخص الكتاب",
  "categoryId": 1,
  "readingLevel": "intermediate",
  "pointsValue": 15,
  "totalCopies": 2
}
```

---

### PATCH /books/:id

تحديث كتاب.

---

### DELETE /books/:id

حذف كتاب.

---

## 📖 Book Copies

### GET /book-copies

قائمة نسخ الكتب.

**Query Parameters:**
- `bookId` - تصفية حسب الكتاب
- `status` - available, loaned, reserved, maintenance, lost

---

### POST /book-copies

إضافة نسخة جديدة.

**Request:**
```json
{
  "bookId": 1,
  "copyNumber": "C004",
  "barcode": "BAR010",
  "condition": "new",
  "location": "main-shelf",
  "purchaseDate": "2024-01-15"
}
```

---

## 🎓 Students

### GET /students

قائمة الطلاب.

**Query Parameters:**
- `classId` - تصفية حسب الفصل
- `isActive` - true/false

**Response (200):**
```json
[
  {
    "id": 1,
    "studentId": "STD001",
    "firstName": "أحمد",
    "lastName": "محمد",
    "dateOfBirth": "2015-05-15",
    "gender": "male",
    "totalPoints": 50,
    "readingLevel": "beginner",
    "isActive": true,
    "class": {
      "id": 1,
      "name": "الصف الأول أ",
      "grade": 1
    }
  }
]
```

---

### POST /students

إضافة طالب جديد.

**Request:**
```json
{
  "studentId": "STD004",
  "firstName": "سارة",
  "lastName": "علي",
  "dateOfBirth": "2016-03-20",
  "gender": "female",
  "parentPhone": "0551234567",
  "parentEmail": "parent@email.com",
  "address": "الرياض",
  "classId": 1,
  "readingLevel": "beginner"
}
```

---

## 📝 Classes

### GET /classes

قائمة الفصول.

**Response (200):**
```json
[
  {
    "id": 1,
    "name": "الصف الأول أ",
    "grade": 1,
    "section": "A",
    "capacity": 30,
    "studentCount": 25
  }
]
```

---

### POST /classes

إضافة فصل جديد.

**Request:**
```json
{
  "name": "الصف الثاني ب",
  "grade": 2,
  "section": "B",
  "capacity": 30
}
```

---

## 📦 Loans

### GET /loans

قائمة الاستعارات.

**Query Parameters:**
- `status` - active, returned, overdue
- `studentId` - تصفية حسب الطالب

**Response (200):**
```json
[
  {
    "id": 1,
    "loanDate": "2024-01-10",
    "dueDate": "2024-01-24",
    "returnDate": null,
    "status": "active",
    "renewalCount": 0,
    "student": {
      "id": 1,
      "firstName": "أحمد",
      "lastName": "محمد"
    },
    "bookCopy": {
      "id": 1,
      "book": {
        "title": "مغامرات في الغابة"
      }
    }
  }
]
```

---

### POST /loans

إنشاء استعارة جديدة.

**Request:**
```json
{
  "studentId": 1,
  "bookCopyId": 1,
  "dueDate": "2024-02-01"
}
```

---

### PATCH /loans/:id/return

إرجاع كتاب.

**Response (200):**
```json
{
  "id": 1,
  "status": "returned",
  "returnDate": "2024-01-20"
}
```

---

### POST /loans/:id/renew

تجديد استعارة.

**Response (200):**
```json
{
  "id": 1,
  "dueDate": "2024-02-07",
  "renewalCount": 1
}
```

---

## 📌 Reservations

### GET /reservations

قائمة الحجوزات.

**Query Parameters:**
- `status` - pending, fulfilled, cancelled, expired

---

### POST /reservations

إنشاء حجز جديد.

**Request:**
```json
{
  "studentId": 1,
  "bookId": 1,
  "expiryDays": 3
}
```

---

### PATCH /reservations/:id/fulfill

تنفيذ حجز (عند توفر نسخة).

---

### PATCH /reservations/:id/cancel

إلغاء حجز.

---

## 📊 Reading Activities

### GET /reading-activities

قائمة الأنشطة القرائية.

**Query Parameters:**
- `studentId`
- `loanId`
- `activityType` - reading, quiz, discussion, project

---

### POST /reading-activities

تسجيل نشاط قرائي.

**Request:**
```json
{
  "studentId": 1,
  "loanId": 1,
  "activityType": "reading",
  "activityDate": "2024-01-15",
  "duration": 45,
  "pagesRead": 30,
  "comprehensionScore": 85,
  "feedback": "أداء ممتاز",
  "pointsEarned": 10
}
```

---

## 🏆 Points

### GET /points/student/:id

نقاط طالب محدد.

**Response (200):**
```json
{
  "studentId": 1,
  "totalPoints": 50,
  "transactions": [
    {
      "id": 1,
      "transactionType": "earn",
      "points": 10,
      "reason": "قراءة كتاب",
      "createdAt": "2024-01-15"
    }
  ]
}
```

---

### POST /points/award

منح نقاط لطالب.

**Request:**
```json
{
  "studentId": 1,
  "points": 20,
  "reason": "إنجاز متميز",
  "description": "قرأ 5 كتب في شهر واحد"
}
```

---

### POST /points/deduct

خصم نقاط من طالب.

**Request:**
```json
{
  "studentId": 1,
  "points": 5,
  "reason": "تأخير في الإرجاع",
  "description": "تأخر 3 أيام"
}
```

---

## 📋 Categories

### GET /categories

قائمة تصنيفات الكتب.

**Response (200):**
```json
[
  {
    "id": 1,
    "name": "قصص أطفال",
    "description": "قصص مصورة وروايات للأطفال",
    "colorCode": "#FF6B6B",
    "bookCount": 10
  }
]
```

---

### POST /categories

إضافة تصنيف جديد.

**Request:**
```json
{
  "name": "علوم",
  "description": "كتب علمية وتعليمية",
  "colorCode": "#4ECDC4"
}
```

---

## 🔍 Audit Logs

### GET /audit-logs

سجل التدقيق (admin فقط).

**Query Parameters:**
- `userId`
- `action`
- `entityType`
- `startDate`
- `endDate`

**Response (200):**
```json
[
  {
    "id": 1,
    "action": "USER_LOGIN",
    "entityType": "User",
    "entityId": 1,
    "changes": null,
    "ipAddress": "192.168.1.1",
    "userAgent": "Mozilla/5.0...",
    "createdAt": "2024-01-15T10:30:00Z",
    "user": {
      "id": 1,
      "username": "admin"
    }
  }
]
```

---

## 🎯 الأدوار والصلاحيات

### admin
- ✅ جميع الصلاحيات
- ✅ إدارة المستخدمين
- ✅ عرض سجل التدقيق
- ✅ الإعدادات

### librarian
- ✅ إدارة الكتب والنسخ
- ✅ إدارة الاستعارات والحجوزات
- ✅ تسجيل الأنشطة القرائية
- ✅ منح/خصم النقاط
- ❌ إدارة المستخدمين

### teacher
- ✅ عرض الكتب والطلاب
- ✅ عرض التقارير
- ✅ تسجيل أنشطة قرائية
- ❌ إدارة الكتب
- ❌ إدارة الاستعارات

---

## 📡 Response Codes

| Code | المعنى |
|------|--------|
| 200 | نجح الطلب |
| 201 | تم الإنشاء بنجاح |
| 400 | بيانات غير صحيحة |
| 401 | غير مصرّح (تسجيل دخول مطلوب) |
| 403 | ممنوع (صلاحيات غير كافية) |
| 404 | غير موجود |
| 409 | تعارض (مثل: username موجود) |
| 500 | خطأ في السيرفر |

---

## 🔧 استخدام JWT

جميع الـ endpoints المحمية تتطلب JWT في الـ header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**مثال مع curl:**
```bash
curl -X GET http://localhost:4000/users \
  -H "Authorization: Bearer <your-token>"
```

---

## 📚 موارد إضافية

- [Swagger UI](http://localhost:4000/api) - توثيق تفاعلي
- [Postman Collection](#) - مجموعة طلبات جاهزة
- [README.md](README.md) - نظرة عامة

---

**آخر تحديث:** 2024-12-11  
**الإصدار:** 1.0.0
