# إرشادات الأمان 🔐

دليل شامل لتأمين نظام المكتبة المدرسية.

---

## 🚨 إجراءات ضرورية بعد أول Deploy

### 1. تغيير كلمة مرور Admin فوراً

**الحساب الافتراضي:**
```
Username: admin
Password: admin123  ← غيّرها فوراً!
```

**كيفية التغيير:**

عبر API:
```bash
# 1. تسجيل الدخول
POST /auth/login
{
  "username": "admin",
  "password": "admin123"
}

# 2. تغيير كلمة المرور
PUT /users/me/password
Authorization: Bearer <token>
{
  "oldPassword": "admin123",
  "newPassword": "StrongPassword123!@#"
}
```

### 2. تحديث JWT_SECRET

**لا تستخدم القيمة الافتراضية في الإنتاج!**

```bash
# إنشاء سر قوي
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# حدّث في Vercel Environment Variables
JWT_SECRET=<القيمة_المُنشأة>
```

### 3. تفعيل HTTPS فقط

في الإنتاج، تأكد من:
- ✅ جميع الطلبات عبر HTTPS
- ✅ Vercel يوفر هذا تلقائياً
- ✅ لا تقبل HTTP

---

## 🔒 أفضل ممارسات كلمات المرور

### متطلبات كلمة المرور القوية

```typescript
// يُنصح بإضافة validation في DTO:
@IsString()
@MinLength(8)
@Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
  message: 'كلمة المرور ضعيفة جداً',
})
password: string;
```

يجب أن تحتوي على:
- ✅ 8 أحرف على الأقل
- ✅ حرف كبير
- ✅ حرف صغير
- ✅ رقم
- ✅ رمز خاص (@#$%^&*)

### أمثلة على كلمات مرور قوية

```
✅ LibraryAdmin2024!@
✅ Sch00l@Lib#Secure
✅ MyStr0ng&Pass2024
```

### أمثلة على كلمات مرور ضعيفة

```
❌ admin123
❌ password
❌ 12345678
❌ admin
❌ school
```

---

## 🛡️ تأمين قاعدة البيانات

### 1. Supabase Security

```sql
-- تأكد من Row Level Security (RLS) في Supabase
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- فقط للقراءة من خلال API
CREATE POLICY "API only" ON users
  USING (auth.role() = 'service_role');
```

### 2. الاتصال الآمن

```env
# استخدم SSL في الإنتاج
DATABASE_URL=postgresql://user:pass@host:5432/db?sslmode=require

# استخدم Connection Pooler
DATABASE_URL=postgresql://...@db.xxx.supabase.co:5432/postgres?pgbouncer=true
```

### 3. قيود الاتصالات

```typescript
// في database.config.ts
{
  // حدد عدد الاتصالات
  extra: {
    max: 10,  // أقصى عدد اتصالات
    min: 2,   // أدنى عدد اتصالات
    idleTimeoutMillis: 30000,
  }
}
```

---

## 🔐 JWT وإدارة الجلسات

### 1. إعدادات JWT آمنة

```typescript
// في auth module:
JwtModule.register({
  secret: process.env.JWT_SECRET,
  signOptions: {
    expiresIn: '1h',  // انتهاء بعد ساعة
    issuer: 'school-library',
    audience: 'school-library-api',
  },
});
```

### 2. Refresh Tokens (مُنصح به)

```typescript
// إضافة refresh token
{
  accessToken: 'xxx',  // صالح لساعة
  refreshToken: 'yyy', // صالح لأسبوع
}
```

### 3. إبطال الجلسات

```typescript
// حفظ tokens في قاعدة البيانات
@Entity('tokens')
export class Token {
  @Column()
  token: string;

  @Column()
  isRevoked: boolean;

  @Column()
  expiresAt: Date;
}
```

---

## 🚫 الحماية من الهجمات

### 1. Rate Limiting

```bash
npm install @nestjs/throttler
```

```typescript
// في app.module.ts
ThrottlerModule.forRoot({
  ttl: 60,      // 60 ثانية
  limit: 10,    // 10 طلبات
}),
```

### 2. CORS آمن

```typescript
// في main.ts
app.enableCors({
  origin: [
    'https://your-frontend.vercel.app',
    process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '',
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
});
```

### 3. Helmet للحماية

```bash
npm install helmet
```

```typescript
// في main.ts
import helmet from 'helmet';

app.use(helmet());
```

### 4. منع SQL Injection

```typescript
// ✅ استخدم دائماً parameterized queries
await queryRunner.query(`
  SELECT * FROM users WHERE username = $1
`, [username]);

// ❌ لا تستخدم string concatenation
await queryRunner.query(`
  SELECT * FROM users WHERE username = '${username}'  // خطر!
`);
```

---

## 🔍 Audit والمراقبة

### 1. تفعيل Audit Logs

```typescript
// كل عملية حساسة يجب أن تُسجَّل
await this.auditLogService.log({
  action: 'USER_PASSWORD_CHANGED',
  userId: user.id,
  entityType: 'User',
  entityId: user.id,
  changes: { passwordChanged: true },
  ipAddress: req.ip,
});
```

### 2. مراقبة محاولات تسجيل الدخول الفاشلة

```typescript
// عدّاد للمحاولات الفاشلة
if (failedAttempts > 5) {
  // قفل الحساب لـ 15 دقيقة
  await this.lockAccount(username, 15);
  throw new UnauthorizedException('حسابك مقفل مؤقتاً');
}
```

### 3. إشعارات الأمان

```typescript
// إرسال إشعار عند:
- تغيير كلمة المرور
- تسجيل دخول من جهاز جديد
- محاولات فاشلة متعددة
- تغيير البريد الإلكتروني
```

---

## 📋 Checklist الأمان

### عند أول Deploy

- [ ] غيّر كلمة مرور admin
- [ ] حدّث JWT_SECRET
- [ ] فعّل HTTPS
- [ ] راجع CORS settings
- [ ] فعّل Rate Limiting
- [ ] راجع Database permissions

### بشكل دوري

- [ ] راجع Audit Logs
- [ ] حدّث التبعيات (npm audit)
- [ ] راجع محاولات تسجيل الدخول الفاشلة
- [ ] نسخ احتياطي لقاعدة البيانات
- [ ] راجع صلاحيات المستخدمين

### عند إضافة ميزة جديدة

- [ ] تحقق من الصلاحيات (Guards)
- [ ] Validate جميع المدخلات
- [ ] استخدم Parameterized Queries
- [ ] سجّل في Audit Log
- [ ] اختبر السيناريوهات الخطرة

---

## 🚨 في حالة اختراق مشتبه

### 1. إجراءات فورية

```bash
# 1. أوقف السيرفر
vercel --prod stop

# 2. غيّر جميع كلمات المرور
# 3. غيّر JWT_SECRET
# 4. راجع Audit Logs

psql -d school_library -c "
  SELECT * FROM audit_logs 
  WHERE \"createdAt\" > NOW() - INTERVAL '24 hours'
  ORDER BY \"createdAt\" DESC;
"

# 5. راجع المستخدمين النشطين
psql -d school_library -c "
  SELECT id, username, email, \"createdAt\" 
  FROM users 
  WHERE \"isActive\" = true;
"
```

### 2. التحقيق

- [ ] راجع سجلات Vercel
- [ ] راجع Audit Logs
- [ ] تحقق من المستخدمين الجدد
- [ ] راجع التغييرات الأخيرة

### 3. الاستعادة

- [ ] استعد من آخر نسخة احتياطية نظيفة
- [ ] غيّر جميع الأسرار (JWT_SECRET, DB passwords)
- [ ] أبطل جميع الجلسات
- [ ] أعد تشغيل النظام

---

## 📚 موارد إضافية

### الأدوات المُنصح بها

```bash
# فحص الثغرات
npm audit

# تحديث الحزم الآمنة
npm audit fix

# فحص شامل
npm install -g snyk
snyk test
```

### مراجع مفيدة

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [NestJS Security](https://docs.nestjs.com/security/authentication)
- [PostgreSQL Security](https://www.postgresql.org/docs/current/auth-pg-hba-conf.html)

---

## 📞 جهات الاتصال

في حالة اكتشاف ثغرة أمنية:

1. **لا** تنشرها علناً
2. أبلغ المسؤول فوراً
3. وثّق التفاصيل
4. انتظر الحل قبل الإفصاح

---

**آخر مراجعة:** 2024  
**مستوى الأهمية:** 🔴 حرج  
**يُراجَع:** شهرياً
