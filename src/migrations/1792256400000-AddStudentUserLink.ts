import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddStudentUserLink1792256400000 implements MigrationInterface {
  name = 'AddStudentUserLink1792256400000';

  async up(queryRunner: QueryRunner): Promise<void> {
    if (!(await queryRunner.hasColumn('students', 'user_id'))) {
      await queryRunner.query('ALTER TABLE "students" ADD "user_id" integer');
      await queryRunner.query(
        'ALTER TABLE "students" ADD CONSTRAINT "UQ_students_user_id" UNIQUE ("user_id")',
      );
      await queryRunner.query(
        'ALTER TABLE "students" ADD CONSTRAINT "FK_students_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION',
      );
    }
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    if (await queryRunner.hasColumn('students', 'user_id')) {
      await queryRunner.query('ALTER TABLE "students" DROP CONSTRAINT "FK_students_user_id"');
      await queryRunner.query('ALTER TABLE "students" DROP CONSTRAINT "UQ_students_user_id"');
      await queryRunner.query('ALTER TABLE "students" DROP COLUMN "user_id"');
    }
  }
}
