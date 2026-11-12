-- Seed Data للنظام
-- يمكن تشغيله بعد migrations لإضافة بيانات تجريبية

-- 1. الأدوار (Roles)
INSERT INTO roles (name, description, "createdAt", "updatedAt") VALUES
('admin', 'مدير النظام - صلاحيات كاملة', NOW(), NOW()),
('librarian', 'أمين المكتبة - إدارة الكتب والاستعارات', NOW(), NOW()),
('teacher', 'معلم - عرض التقارير وتتبع الطلاب', NOW(), NOW())
ON CONFLICT (name) DO NOTHING;

-- 2. المستخدمين (Users)
-- كلمة المرور: password123 (مشفرة بـ bcrypt)
INSERT INTO users (username, email, password, "fullName", "isActive", "createdAt", "updatedAt", "roleId") VALUES
('admin', 'admin@school.edu', '$2b$10$YourHashedPasswordHere', 'المدير العام', true, NOW(), NOW(), 1),
('librarian1', 'librarian@school.edu', '$2b$10$YourHashedPasswordHere', 'أمين المكتبة', true, NOW(), NOW(), 2),
('teacher1', 'teacher@school.edu', '$2b$10$YourHashedPasswordHere', 'المعلم الأول', true, NOW(), NOW(), 3)
ON CONFLICT (username) DO NOTHING;

-- 3. الفصول (Classes)
INSERT INTO classes (name, grade, section, capacity, "createdAt", "updatedAt") VALUES
('الصف الأول أ', 1, 'A', 30, NOW(), NOW()),
('الصف الأول ب', 1, 'B', 30, NOW(), NOW()),
('الصف الثاني أ', 2, 'A', 30, NOW(), NOW()),
('الصف الثالث أ', 3, 'A', 30, NOW(), NOW())
ON CONFLICT (name) DO NOTHING;

-- 4. الطلاب (Students)
INSERT INTO students ("studentId", "firstName", "lastName", "dateOfBirth", gender, "parentPhone", "parentEmail", address, "enrollmentDate", "isActive", "totalPoints", "readingLevel", "createdAt", "updatedAt", "classId") VALUES
('STD001', 'أحمد', 'محمد', '2015-05-15', 'male', '0551234567', 'parent1@email.com', 'الرياض', NOW(), true, 0, 'beginner', NOW(), NOW(), 1),
('STD002', 'فاطمة', 'علي', '2015-07-20', 'female', '0557654321', 'parent2@email.com', 'الرياض', NOW(), true, 0, 'beginner', NOW(), NOW(), 1),
('STD003', 'محمد', 'عبدالله', '2014-03-10', 'male', '0559876543', 'parent3@email.com', 'الرياض', NOW(), true, 0, 'intermediate', NOW(), NOW(), 2)
ON CONFLICT ("studentId") DO NOTHING;

-- 5. تصنيفات الكتب (Categories)
INSERT INTO categories (name, description, "colorCode", "createdAt", "updatedAt") VALUES
('قصص أطفال', 'قصص مصورة وروايات للأطفال', '#FF6B6B', NOW(), NOW()),
('علوم', 'كتب علمية وتعليمية', '#4ECDC4', NOW(), NOW()),
('تاريخ', 'كتب التاريخ والحضارات', '#95E1D3', NOW(), NOW()),
('دين', 'كتب دينية وإسلامية', '#F38181', NOW(), NOW()),
('رياضيات', 'كتب رياضيات وحساب', '#AA96DA', NOW(), NOW())
ON CONFLICT (name) DO NOTHING;

-- 6. الكتب (Books)
INSERT INTO books (isbn, title, author, publisher, "publishedYear", language, "pageCount", summary, "coverImage", "ageRange", "readingLevel", "pointsValue", "totalCopies", "availableCopies", "isActive", "createdAt", "updatedAt", "categoryId") VALUES
('978-1234567890', 'مغامرات في الغابة', 'محمد الكاتب', 'دار النشر', 2020, 'ar', 120, 'قصة مشوقة عن مغامرات في الغابة', NULL, '6-9', 'beginner', 10, 3, 3, true, NOW(), NOW(), 1),
('978-1234567891', 'عالم الفضاء', 'أحمد العالم', 'دار العلوم', 2019, 'ar', 200, 'كتاب تعليمي عن الفضاء والكواكب', NULL, '9-12', 'intermediate', 15, 2, 2, true, NOW(), NOW(), 2),
('978-1234567892', 'الأرقام السحرية', 'فاطمة الرياضية', 'دار المعرفة', 2021, 'ar', 80, 'تعلم الرياضيات بطريقة ممتعة', NULL, '6-9', 'beginner', 8, 4, 4, true, NOW(), NOW(), 5)
ON CONFLICT (isbn) DO NOTHING;

-- 7. نسخ الكتب (Book Copies)
INSERT INTO book_copies ("copyNumber", barcode, condition, location, status, "purchaseDate", "createdAt", "updatedAt", "bookId") VALUES
('C001', 'BAR001', 'new', 'main-shelf', 'available', '2023-01-15', NOW(), NOW(), 1),
('C002', 'BAR002', 'new', 'main-shelf', 'available', '2023-01-15', NOW(), NOW(), 1),
('C003', 'BAR003', 'good', 'main-shelf', 'available', '2023-01-15', NOW(), NOW(), 1),
('C004', 'BAR004', 'new', 'science-section', 'available', '2023-02-20', NOW(), NOW(), 2),
('C005', 'BAR005', 'new', 'science-section', 'available', '2023-02-20', NOW(), NOW(), 2),
('C006', 'BAR006', 'new', 'math-section', 'available', '2023-03-10', NOW(), NOW(), 3),
('C007', 'BAR007', 'new', 'math-section', 'available', '2023-03-10', NOW(), NOW(), 3),
('C008', 'BAR008', 'new', 'math-section', 'available', '2023-03-10', NOW(), NOW(), 3),
('C009', 'BAR009', 'new', 'math-section', 'available', '2023-03-10', NOW(), NOW(), 3)
ON CONFLICT (barcode) DO NOTHING;

-- ملاحظة: 
-- كلمات المرور في هذا الملف هي أمثلة فقط
-- يجب استخدام bcrypt لتشفير كلمات المرور الحقيقية
-- يمكن إنشاء hash بـ: bcrypt.hash('password123', 10)
