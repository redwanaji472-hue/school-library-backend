const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 إعداد قاعدة البيانات للمشروع...\n');

// 1. Check if .env exists
const envPath = path.join(__dirname, '..', '.env');
if (!fs.existsSync(envPath)) {
  console.log('❌ ملف .env غير موجود!');
  console.log('📝 يرجى نسخ ملف .env.example إلى .env وتعديل الإعدادات.\n');
  console.log('يمكنك فعل ذلك بالأمر:');
  console.log('  cp .env.example .env\n');
  process.exit(1);
}

console.log('✅ ملف .env موجود');

// 2. Load environment variables
require('dotenv').config({ path: envPath });

// 3. Test database connection
console.log('\n📡 اختبار الاتصال بقاعدة البيانات...');

try {
  const { Client } = require('pg');
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS,
    database: 'postgres', // Connect to default database first
  });

  (async () => {
    try {
      await client.connect();
      console.log('✅ الاتصال بـ PostgreSQL نجح');

      // Check if database exists
      const dbName = process.env.DB_NAME || 'school_library';
      const result = await client.query(
        `SELECT 1 FROM pg_database WHERE datname = $1`,
        [dbName]
      );

      if (result.rows.length === 0) {
        console.log(`\n📦 إنشاء قاعدة البيانات: ${dbName}`);
        await client.query(`CREATE DATABASE ${dbName}`);
        console.log('✅ قاعدة البيانات تم إنشاؤها بنجاح');
      } else {
        console.log(`✅ قاعدة البيانات ${dbName} موجودة بالفعل`);
      }

      await client.end();

      // 4. Run migrations
      console.log('\n🔄 تشغيل الـ Migrations...');
      try {
        execSync('npm run migration:run', { stdio: 'inherit' });
        console.log('\n✅ الـ Migrations تم تشغيلها بنجاح');
      } catch (error) {
        console.log('\n⚠️  حدث خطأ أثناء تشغيل الـ Migrations');
        console.log('💡 يمكنك تشغيلها يدوياً بالأمر: npm run migration:run\n');
      }

      console.log('\n🎉 الإعداد اكتمل بنجاح!');
      console.log('\n📝 الخطوات التالية:');
      console.log('  1. شغل السيرفر: npm run start:dev');
      console.log('  2. افتح المتصفح: http://localhost:4000/api\n');

    } catch (error) {
      console.error('\n❌ خطأ:', error.message);
      console.log('\n💡 تأكد من:');
      console.log('  1. PostgreSQL يعمل');
      console.log('  2. إعدادات .env صحيحة');
      console.log('  3. يمكنك الاتصال بـ PostgreSQL\n');
      process.exit(1);
    }
  })();

} catch (error) {
  console.error('\n❌ خطأ في تحميل pg module:', error.message);
  console.log('💡 تأكد من تثبيت الحزم: npm install\n');
  process.exit(1);
}
