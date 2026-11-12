# ابدأ من هنا 🚀

مرحباً بك في نظام إدارة المكتبة المدرسية!

---

## ⚡ البداية السريعة (3 دقائق)

```bash
npm install
cp .env.example .env
npm run setup:db
npm run start:dev
```

🎉 السيرفر يعمل: `http://localhost:4000`

---

## 🔐 تسجيل الدخول

```
Username: admin
Password: admin123
```

⚠️ **مهم:** غيّر كلمة المرور فوراً!

---

## 📖 الأدلة

| أريد... | اقرأ |
|---------|------|
| البدء بسرعة | [QUICK_START.md](QUICK_START.md) |
| تسجيل الدخول | [ADMIN_SETUP.md](ADMIN_SETUP.md) |
| النشر | [DEPLOYMENT.md](DEPLOYMENT.md) |
| أمثلة | [EXAMPLES.md](EXAMPLES.md) |
| كل شيء | [README.md](README.md) |

---

## ✅ تحقق من النجاح

```bash
# 1. السيرفر يعمل؟
curl http://localhost:4000/api

# 2. الجداول موجودة؟
npm run migration:show

# 3. Admin موجود؟
psql -d school_library -c "SELECT username FROM users WHERE username='admin';"
```

---

## 🆘 مشكلة؟

- راجع [QUICK_START.md](QUICK_START.md) - قسم "استكشاف الأخطاء"
- راجع [EXAMPLES.md](EXAMPLES.md) - السيناريو 10
- افتح Issue في GitHub

---

## 📚 الهيكل

```
✅ 12 جدول جاهز
✅ Admin + 3 أدوار
✅ Migrations محترفة
✅ API Documentation
✅ آمن للإنتاج
```

---

## 🚀 الخطوات التالية

1. ✅ تسجيل الدخول كـ admin
2. ✅ تغيير كلمة المرور
3. ✅ إضافة فصول وطلاب
4. ✅ إضافة كتب
5. ✅ البدء في استخدام النظام!

---

**جاهز؟ شغّل:** `npm run start:dev` 🎉

**محتاج مساعدة؟ راجع:** [README.md](README.md)
