# أمثلة cURL 🔧

أوامر cURL جاهزة لاختبار API.

---

## 🔐 Authentication

### تسجيل الدخول

```bash
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

**حفظ Token في متغير:**
```bash
TOKEN=$(curl -s -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' \
  | jq -r '.access_token')

echo $TOKEN
```

---

## 👥 Users

### عرض جميع المستخدمين

```bash
curl -X GET http://localhost:4000/users \
  -H "Authorization: Bearer $TOKEN"
```

### عرض مستخدم محدد

```bash
curl -X GET http://localhost:4000/users/1 \
  -H "Authorization: Bearer $TOKEN"
```

### إنشاء مستخدم جديد

```bash
curl -X POST http://localhost:4000/users \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "librarian1",
    "password": "LibPass123!",
    "fullName": "أمين المكتبة",
    "roleId": 2,
    "isActive": true
  }'
```

### تحديث مستخدم

```bash
curl -X PATCH http://localhost:4000/users/2 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "أمين المكتبة المحدّث",
    "isActive": true
  }'
```

### حذف مستخدم

```bash
curl -X DELETE http://localhost:4000/users/2 \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📚 Books

### عرض الكتب

```bash
# جميع الكتب
curl -X GET http://localhost:4000/books \
  -H "Authorization: Bearer $TOKEN"

# مع pagination
curl -X GET "http://localhost:4000/books?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN"

# بحث
curl -X GET "http://localhost:4000/books?search=مغامرات" \
  -H "Authorization: Bearer $TOKEN"

# حسب التصنيف
curl -X GET "http://localhost:4000/books?categoryId=1" \
  -H "Authorization: Bearer $TOKEN"
```

### عرض كتاب محدد

```bash
curl -X GET http://localhost:4000/books/1 \
  -H "Authorization: Bearer $TOKEN"
```

### إضافة كتاب

```bash
curl -X POST http://localhost:4000/books \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "isbn": "978-1234567890",
    "title": "مغامرات في الغابة",
    "author": "محمد الكاتب",
    "publisher": "دار النشر",
    "publishedYear": 2020,
    "language": "ar",
    "pageCount": 120,
    "summary": "قصة مشوقة",
    "categoryId": 1,
    "ageRange": "6-9",
    "readingLevel": "beginner",
    "pointsValue": 10,
    "totalCopies": 3
  }'
```

### تحديث كتاب

```bash
curl -X PATCH http://localhost:4000/books/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "pointsValue": 15,
    "availableCopies": 2
  }'
```

### حذف كتاب

```bash
curl -X DELETE http://localhost:4000/books/1 \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📖 Book Copies

### عرض نسخ الكتب

```bash
# جميع النسخ
curl -X GET http://localhost:4000/book-copies \
  -H "Authorization: Bearer $TOKEN"

# نسخ كتاب محدد
curl -X GET "http://localhost:4000/book-copies?bookId=1" \
  -H "Authorization: Bearer $TOKEN"

# نسخ متاحة فقط
curl -X GET "http://localhost:4000/book-copies?status=available" \
  -H "Authorization: Bearer $TOKEN"
```

### إضافة نسخة

```bash
curl -X POST http://localhost:4000/book-copies \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "bookId": 1,
    "copyNumber": "C004",
    "barcode": "BAR010",
    "condition": "new",
    "location": "main-shelf",
    "purchaseDate": "2024-01-15"
  }'
```

---

## 🎓 Students

### عرض الطلاب

```bash
# جميع الطلاب
curl -X GET http://localhost:4000/students \
  -H "Authorization: Bearer $TOKEN"

# طلاب فصل محدد
curl -X GET "http://localhost:4000/students?classId=1" \
  -H "Authorization: Bearer $TOKEN"

# الطلاب النشطين فقط
curl -X GET "http://localhost:4000/students?isActive=true" \
  -H "Authorization: Bearer $TOKEN"
```

### إضافة طالب

```bash
curl -X POST http://localhost:4000/students \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": "STD001",
    "firstName": "أحمد",
    "lastName": "محمد",
    "dateOfBirth": "2015-05-15",
    "gender": "male",
    "parentPhone": "0551234567",
    "parentEmail": "parent@email.com",
    "address": "الرياض",
    "classId": 1,
    "readingLevel": "beginner"
  }'
```

### تحديث طالب

```bash
curl -X PATCH http://localhost:4000/students/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "readingLevel": "intermediate",
    "totalPoints": 50
  }'
```

---

## 📝 Classes

### عرض الفصول

```bash
curl -X GET http://localhost:4000/classes \
  -H "Authorization: Bearer $TOKEN"
```

### إضافة فصل

```bash
curl -X POST http://localhost:4000/classes \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "الصف الأول أ",
    "grade": 1,
    "section": "A",
    "capacity": 30
  }'
```

---

## 📦 Loans

### عرض الاستعارات

```bash
# جميع الاستعارات
curl -X GET http://localhost:4000/loans \
  -H "Authorization: Bearer $TOKEN"

# الاستعارات النشطة
curl -X GET "http://localhost:4000/loans?status=active" \
  -H "Authorization: Bearer $TOKEN"

# استعارات طالب محدد
curl -X GET "http://localhost:4000/loans?studentId=1" \
  -H "Authorization: Bearer $TOKEN"

# الاستعارات المتأخرة
curl -X GET "http://localhost:4000/loans?status=overdue" \
  -H "Authorization: Bearer $TOKEN"
```

### إنشاء استعارة

```bash
curl -X POST http://localhost:4000/loans \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": 1,
    "bookCopyId": 1,
    "dueDate": "2024-02-01"
  }'
```

### إرجاع كتاب

```bash
curl -X PATCH http://localhost:4000/loans/1/return \
  -H "Authorization: Bearer $TOKEN"
```

### تجديد استعارة

```bash
curl -X POST http://localhost:4000/loans/1/renew \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📌 Reservations

### عرض الحجوزات

```bash
# جميع الحجوزات
curl -X GET http://localhost:4000/reservations \
  -H "Authorization: Bearer $TOKEN"

# الحجوزات المعلقة
curl -X GET "http://localhost:4000/reservations?status=pending" \
  -H "Authorization: Bearer $TOKEN"
```

### إنشاء حجز

```bash
curl -X POST http://localhost:4000/reservations \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": 1,
    "bookId": 1,
    "expiryDays": 3
  }'
```

### تنفيذ حجز

```bash
curl -X PATCH http://localhost:4000/reservations/1/fulfill \
  -H "Authorization: Bearer $TOKEN"
```

### إلغاء حجز

```bash
curl -X PATCH http://localhost:4000/reservations/1/cancel \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📊 Reading Activities

### عرض الأنشطة

```bash
# جميع الأنشطة
curl -X GET http://localhost:4000/reading-activities \
  -H "Authorization: Bearer $TOKEN"

# أنشطة طالب محدد
curl -X GET "http://localhost:4000/reading-activities?studentId=1" \
  -H "Authorization: Bearer $TOKEN"
```

### تسجيل نشاط

```bash
curl -X POST http://localhost:4000/reading-activities \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": 1,
    "loanId": 1,
    "activityType": "reading",
    "activityDate": "2024-01-15",
    "duration": 45,
    "pagesRead": 30,
    "comprehensionScore": 85,
    "feedback": "أداء ممتاز",
    "pointsEarned": 10
  }'
```

---

## 🏆 Points

### عرض نقاط طالب

```bash
curl -X GET http://localhost:4000/points/student/1 \
  -H "Authorization: Bearer $TOKEN"
```

### منح نقاط

```bash
curl -X POST http://localhost:4000/points/award \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": 1,
    "points": 20,
    "reason": "إنجاز متميز",
    "description": "قرأ 5 كتب في شهر"
  }'
```

### خصم نقاط

```bash
curl -X POST http://localhost:4000/points/deduct \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "studentId": 1,
    "points": 5,
    "reason": "تأخير في الإرجاع",
    "description": "تأخر 3 أيام"
  }'
```

---

## 📋 Categories

### عرض التصنيفات

```bash
curl -X GET http://localhost:4000/categories \
  -H "Authorization: Bearer $TOKEN"
```

### إضافة تصنيف

```bash
curl -X POST http://localhost:4000/categories \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "علوم",
    "description": "كتب علمية وتعليمية",
    "colorCode": "#4ECDC4"
  }'
```

---

## 🔍 Audit Logs

### عرض سجل التدقيق

```bash
# جميع السجلات
curl -X GET http://localhost:4000/audit-logs \
  -H "Authorization: Bearer $TOKEN"

# سجلات مستخدم محدد
curl -X GET "http://localhost:4000/audit-logs?userId=1" \
  -H "Authorization: Bearer $TOKEN"

# سجلات نوع محدد
curl -X GET "http://localhost:4000/audit-logs?action=USER_LOGIN" \
  -H "Authorization: Bearer $TOKEN"

# سجلات فترة محددة
curl -X GET "http://localhost:4000/audit-logs?startDate=2024-01-01&endDate=2024-01-31" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 💡 نصائح

### تنسيق JSON

استخدم `jq` لتنسيق الناتج:

```bash
curl -X GET http://localhost:4000/users \
  -H "Authorization: Bearer $TOKEN" | jq '.'
```

### حفظ الناتج في ملف

```bash
curl -X GET http://localhost:4000/books \
  -H "Authorization: Bearer $TOKEN" \
  -o books.json
```

### عرض Headers

```bash
curl -X GET http://localhost:4000/users \
  -H "Authorization: Bearer $TOKEN" \
  -i
```

### Verbose Mode

```bash
curl -X GET http://localhost:4000/users \
  -H "Authorization: Bearer $TOKEN" \
  -v
```

---

## 🔧 Script للاختبار السريع

```bash
#!/bin/bash

# تسجيل الدخول وحفظ Token
echo "🔐 تسجيل الدخول..."
TOKEN=$(curl -s -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' \
  | jq -r '.access_token')

if [ -z "$TOKEN" ] || [ "$TOKEN" = "null" ]; then
  echo "❌ فشل تسجيل الدخول"
  exit 1
fi

echo "✅ تم تسجيل الدخول بنجاح"
echo "Token: $TOKEN"

# اختبار endpoints
echo -e "\n📚 جلب الكتب..."
curl -s -X GET http://localhost:4000/books \
  -H "Authorization: Bearer $TOKEN" | jq '.data | length'

echo -e "\n🎓 جلب الطلاب..."
curl -s -X GET http://localhost:4000/students \
  -H "Authorization: Bearer $TOKEN" | jq 'length'

echo -e "\n📦 جلب الاستعارات..."
curl -s -X GET http://localhost:4000/loans \
  -H "Authorization: Bearer $TOKEN" | jq 'length'

echo -e "\n✅ الاختبار اكتمل!"
```

حفظ كـ `test-api.sh` وشغله:
```bash
chmod +x test-api.sh
./test-api.sh
```

---

## 📚 موارد إضافية

- [API_REFERENCE.md](API_REFERENCE.md) - مرجع كامل
- [Swagger UI](http://localhost:4000/api) - توثيق تفاعلي
- [Postman](https://www.postman.com/) - أداة اختبار GUI

---

**آخر تحديث:** 2024-12-11  
**الإصدار:** 1.0.0
