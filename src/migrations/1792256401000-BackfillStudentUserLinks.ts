import { MigrationInterface, QueryRunner } from 'typeorm';

export class BackfillStudentUserLinks1792256401000 implements MigrationInterface {
  name = 'BackfillStudentUserLinks1792256401000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE "students" AS student
      SET "user_id" = account."id"
      FROM (
        SELECT MIN("users"."id") AS "id", "users"."full_name"
        FROM "users"
        INNER JOIN "roles" ON "roles"."id" = "users"."role_id"
        WHERE "roles"."name" = 'student'
        GROUP BY "users"."full_name"
        HAVING COUNT(*) = 1
      ) AS account
      WHERE student."user_id" IS NULL
        AND student."full_name" = account."full_name"
        AND (
          SELECT COUNT(*)
          FROM "students" AS same_name
          WHERE same_name."full_name" = student."full_name"
        ) = 1
    `);
  }

  async down(): Promise<void> {
    // The links are safe to keep; reversing them could remove links made after this migration.
  }
}
