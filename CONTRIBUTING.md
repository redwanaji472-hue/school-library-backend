# دليل المساهمة 🤝

شكراً لاهتمامك بالمساهمة في نظام إدارة المكتبة المدرسية!

---

## 📋 قبل البدء

### اقرأ الوثائق

- [README.md](README.md) - نظرة عامة
- [QUICK_START.md](QUICK_START.md) - الإعداد المحلي
- [EXAMPLES.md](EXAMPLES.md) - أمثلة الكود

### متطلبات البيئة

- Node.js v16+
- PostgreSQL v12+
- Git
- محرر نصوص (VS Code مُنصح به)

---

## 🚀 الإعداد للمساهمة

### 1. Fork وClone

```bash
# Fork المشروع على GitHub أولاً
git clone https://github.com/YOUR_USERNAME/school-library-backend.git
cd school-library-backend

# إضافة upstream
git remote add upstream https://github.com/ORIGINAL/school-library-backend.git
```

### 2. الإعداد المحلي

```bash
# التثبيت
npm install

# إعداد البيئة
cp .env.example .env
# عدّل .env حسب بيئتك

# إعداد قاعدة البيانات
npm run setup:db

# التشغيل
npm run start:dev
```

### 3. إنشاء Branch

```bash
# أنشئ branch للميزة أو الإصلاح
git checkout -b feature/amazing-feature
# أو
git checkout -b fix/bug-description
```

---

## 💻 معايير الكود

### TypeScript

```typescript
// ✅ استخدم أسماء واضحة
export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  author: string;
}

// ✅ أضف تعليقات للكود المعقد
/**
 * حساب تاريخ الاستحقاق بناءً على نوع المستخدم
 * @param loanDate تاريخ الاستعارة
 * @param userRole دور المستخدم
 * @returns تاريخ الاستحقاق
 */
calculateDueDate(loanDate: Date, userRole: string): Date {
  // المنطق هنا...
}

// ✅ استخدم async/await بدلاً من Promises
async createBook(dto: CreateBookDto): Promise<Book> {
  return await this.bookRepository.save(dto);
}
```

### تسمية الملفات

```
✅ kebab-case للملفات
   book-copy.entity.ts
   create-loan.dto.ts
   audit-log.service.ts

✅ PascalCase للـ Classes
   export class BookCopy {}
   export class CreateLoanDto {}
   export class AuditLogService {}
```

### الهيكل

```
src/
└── modules/
    └── books/
        ├── entities/
        │   └── book.entity.ts
        ├── dto/
        │   ├── create-book.dto.ts
        │   └── update-book.dto.ts
        ├── books.controller.ts
        ├── books.service.ts
        └── books.module.ts
```

---

## 🗄️ Database Migrations

### إضافة ميزة جديدة

```bash
# 1. عدّل Entity
# src/modules/books/entities/book.entity.ts

# 2. أنشئ migration
npm run migration:generate src/migrations/AddFieldToBooks

# 3. راجع الملف المُنشأ
# src/migrations/[timestamp]-AddFieldToBooks.ts

# 4. اختبر
npm run migration:run
npm run start:dev

# 5. تأكد من down() method
npm run migration:revert
npm run migration:run
```

### قواعد Migrations

1. **لا تعدل migration** بعد merge إلى main
2. **اختبر up() و down()** دائماً
3. **استخدم Parameterized Queries** لمنع SQL Injection
4. **أضف تعليقات** للتغييرات المعقدة

```typescript
// ✅ جيد
await queryRunner.query(`
  ALTER TABLE books 
  ADD COLUMN "rating" integer DEFAULT 0
  CHECK ("rating" >= 0 AND "rating" <= 5)
`);

// ❌ سيء - بدون validation
await queryRunner.query(`ALTER TABLE books ADD COLUMN rating integer`);
```

---

## 🧪 الاختبارات

### كتابة Tests

```bash
# تشغيل الاختبارات
npm run test

# مع Coverage
npm run test:cov

# E2E tests
npm run test:e2e
```

### مثال

```typescript
// books.service.spec.ts
describe('BooksService', () => {
  let service: BooksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BooksService],
    }).compile();

    service = module.get<BooksService>(BooksService);
  });

  it('should create a book', async () => {
    const dto = { title: 'Test Book', author: 'Test Author' };
    const result = await service.create(dto);
    expect(result.title).toBe('Test Book');
  });
});
```

### متطلبات

- [ ] جميع Tests تمر ✅
- [ ] Coverage لا يقل عن 80%
- [ ] E2E tests للـ endpoints الجديدة

---

## 📝 Commit Messages

### التنسيق

```
<type>(<scope>): <subject>

<body>

<footer>
```

### الأنواع

- `feat`: ميزة جديدة
- `fix`: إصلاح bug
- `docs`: تحديث التوثيق
- `style`: تنسيق الكود
- `refactor`: إعادة هيكلة
- `test`: إضافة tests
- `chore`: مهام صيانة

### أمثلة

```bash
# ✅ جيد
feat(books): add book rating system

Added rating field to Book entity with validation (0-5).
Created migration and updated DTOs.

Closes #123

# ✅ جيد
fix(loans): calculate due date correctly

Fixed bug where due date was calculated incorrectly
for teacher role.

Fixes #456

# ✅ جيد
docs: update ADMIN_SETUP with password reset

Added section for emergency password reset via CLI.

# ❌ سيء
update stuff
fixed bug
changes
```

---

## 🔄 Pull Request Process

### 1. قبل الـ PR

```bash
# تحديث branch
git fetch upstream
git rebase upstream/main

# فحص الكود
npm run lint
npm run format

# اختبار
npm run test
npm run build
```

### 2. إنشاء PR

**العنوان:**
```
feat: Add book rating system
```

**الوصف:**
```markdown
## 📝 التغييرات

- إضافة حقل rating للكتب (0-5)
- إضافة validation
- إضافة migration

## 🧪 الاختبار

- [ ] Unit tests تمر
- [ ] E2E tests تمر
- [ ] اختبار يدوي

## 📸 Screenshots (إذا كان UI)

[صورة هنا]

## 🔗 Related Issues

Closes #123
```

### 3. Code Review

- تابع التعليقات بسرعة
- كن متقبلاً للملاحظات
- اشرح قراراتك إذا لزم
- حدّث PR بناءً على المراجعة

### 4. الـ Merge

- بعد الموافقة، سيتم الـ merge
- احذف branch بعد الـ merge
- تابع CI/CD للتأكد من النشر

---

## 🔐 الأمان

### قواعد مهمة

1. **لا ترفع Secrets** في Git
   ```bash
   # ❌ لا تفعل
   JWT_SECRET=my-secret-key
   
   # ✅ استخدم environment variables
   JWT_SECRET=process.env.JWT_SECRET
   ```

2. **استخدم Parameterized Queries**
   ```typescript
   // ✅ جيد
   await repository.query(`SELECT * FROM users WHERE id = $1`, [userId]);
   
   // ❌ خطر - SQL Injection
   await repository.query(`SELECT * FROM users WHERE id = ${userId}`);
   ```

3. **Validate المدخلات**
   ```typescript
   // ✅ دائماً استخدم DTOs مع validation
   export class CreateBookDto {
     @IsString()
     @MinLength(1)
     @MaxLength(200)
     title: string;
   }
   ```

4. **راجع [SECURITY.md](SECURITY.md)**

---

## 📚 إضافة Documentation

### عند إضافة ميزة

1. حدّث [README.md](README.md) إذا لزم
2. أضف مثال في [EXAMPLES.md](EXAMPLES.md)
3. حدّث API docs (Swagger)
4. أضف تعليقات في الكود

### مثال Swagger

```typescript
@ApiTags('books')
@Controller('books')
export class BooksController {
  @Post()
  @ApiOperation({ summary: 'إنشاء كتاب جديد' })
  @ApiResponse({ status: 201, description: 'تم الإنشاء بنجاح' })
  @ApiResponse({ status: 400, description: 'بيانات غير صحيحة' })
  create(@Body() dto: CreateBookDto) {
    return this.booksService.create(dto);
  }
}
```

---

## 🎯 أفكار للمساهمة

### مستوى مبتدئ

- تحسين التوثيق
- إضافة tests
- إصلاح أخطاء إملائية
- تحسين رسائل الأخطاء

### مستوى متوسط

- إضافة validation جديدة
- تحسين الأداء
- إضافة indexes للقاعدة
- refactoring

### مستوى متقدم

- ميزات جديدة
- تحسينات معمارية
- تكامل مع خدمات خارجية
- تحسينات أمنية

---

## 💡 نصائح

### الكود

- اكتب كود واضح أولاً، ثم حسّنه
- استخدم TypeScript بشكل صحيح (types)
- اتبع DRY (Don't Repeat Yourself)
- KISS (Keep It Simple, Stupid)

### Git

- commits صغيرة ومركّزة
- push بانتظام
- rebase بدلاً من merge للتحديثات

### التواصل

- اسأل عند الشك
- شارك أفكارك في Issues
- كن محترماً ومهنياً

---

## ❓ أسئلة شائعة

### كيف أبدأ؟

راجع [QUICK_START.md](QUICK_START.md)

### أين أجد أمثلة؟

راجع [EXAMPLES.md](EXAMPLES.md)

### كيف أعمل migration؟

راجع [src/migrations/README.md](src/migrations/README.md)

### لدي سؤال

افتح Discussion في GitHub

---

## 📞 الدعم

- GitHub Issues: للـ bugs
- GitHub Discussions: للأسئلة
- Pull Requests: للمساهمات

---

## 🙏 شكراً

شكراً لمساهمتك في تحسين نظام المكتبة المدرسية! 

كل مساهمة، صغيرة أو كبيرة، تساعد في جعل النظام أفضل للجميع.

---

**حظاً موفقاً! 🚀**
