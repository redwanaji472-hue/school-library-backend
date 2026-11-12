import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';

export class SeedAdminUser1700000000001 implements MigrationInterface {
  name = 'SeedAdminUser1700000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // تشفير كلمة المرور: admin123
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // إضافة الأدوار الأساسية
    await queryRunner.query(`
      INSERT INTO roles (name, description, "createdAt", "updatedAt") 
      VALUES 
        ('admin', 'مدير النظام - صلاحيات كاملة', NOW(), NOW()),
        ('librarian', 'أمين المكتبة - إدارة الكتب والاستعارات', NOW(), NOW()),
        ('teacher', 'معلم - عرض التقارير وتتبع الطلاب', NOW(), NOW())
      ON CONFLICT (name) DO NOTHING
    `);

    // الحصول على ID دور المدير
    const roleResult = await queryRunner.query(`
      SELECT id FROM roles WHERE name = 'admin' LIMIT 1
    `);
    const adminRoleId = roleResult[0]?.id;

    if (!adminRoleId) {
      throw new Error('Failed to get admin role ID');
    }

    // إضافة حساب المدير الافتراضي
    await queryRunner.query(`
      INSERT INTO users (username, email, password, "fullName", "isActive", "createdAt", "updatedAt", "roleId") 
      VALUES 
        ('admin', 'admin@school.edu', $1, 'مدير النظام', true, NOW(), NOW(), $2)
      ON CONFLICT (username) DO NOTHING
    `, [hashedPassword, adminRoleId]);

    console.log('✅ تم إنشاء حساب المدير الافتراضي');
    console.log('📧 Username: admin');
    console.log('🔑 Password: admin123');
    console.log('⚠️  يُرجى تغيير كلمة المرور بعد أول تسجيل دخول!');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // حذف حساب المدير الافتراضي
    await queryRunner.query(`
      DELETE FROM users WHERE username = 'admin'
    `);

    // حذف الأدوار
    await queryRunner.query(`
      DELETE FROM roles WHERE name IN ('admin', 'librarian', 'teacher')
    `);

    console.log('✅ تم حذف حساب المدير والأدوار');
  }
}
