import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1700000000000 implements MigrationInterface {
  name = 'InitialSchema1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create roles table
    await queryRunner.query(`
      CREATE TABLE "roles" (
        "id" SERIAL PRIMARY KEY,
        "name" character varying NOT NULL UNIQUE,
        "description" character varying,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
      )
    `);

    // Create users table
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" SERIAL PRIMARY KEY,
        "username" character varying NOT NULL UNIQUE,
        "email" character varying NOT NULL UNIQUE,
        "password" character varying NOT NULL,
        "fullName" character varying NOT NULL,
        "isActive" boolean NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "roleId" integer
      )
    `);

    // Create classes table
    await queryRunner.query(`
      CREATE TABLE "classes" (
        "id" SERIAL PRIMARY KEY,
        "name" character varying NOT NULL UNIQUE,
        "grade" integer NOT NULL,
        "section" character varying NOT NULL,
        "capacity" integer NOT NULL DEFAULT 30,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
      )
    `);

    // Create students table
    await queryRunner.query(`
      CREATE TABLE "students" (
        "id" SERIAL PRIMARY KEY,
        "studentId" character varying NOT NULL UNIQUE,
        "firstName" character varying NOT NULL,
        "lastName" character varying NOT NULL,
        "dateOfBirth" TIMESTAMP NOT NULL,
        "gender" character varying NOT NULL,
        "parentPhone" character varying NOT NULL,
        "parentEmail" character varying,
        "address" character varying,
        "enrollmentDate" TIMESTAMP NOT NULL DEFAULT now(),
        "isActive" boolean NOT NULL DEFAULT true,
        "totalPoints" integer NOT NULL DEFAULT 0,
        "readingLevel" character varying NOT NULL DEFAULT 'beginner',
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "classId" integer
      )
    `);

    // Create categories table
    await queryRunner.query(`
      CREATE TABLE "categories" (
        "id" SERIAL PRIMARY KEY,
        "name" character varying NOT NULL UNIQUE,
        "description" character varying,
        "colorCode" character varying,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
      )
    `);

    // Create books table
    await queryRunner.query(`
      CREATE TABLE "books" (
        "id" SERIAL PRIMARY KEY,
        "isbn" character varying NOT NULL UNIQUE,
        "title" character varying NOT NULL,
        "author" character varying NOT NULL,
        "publisher" character varying,
        "publishedYear" integer,
        "language" character varying NOT NULL DEFAULT 'ar',
        "pageCount" integer,
        "summary" text,
        "coverImage" character varying,
        "ageRange" character varying,
        "readingLevel" character varying NOT NULL DEFAULT 'beginner',
        "pointsValue" integer NOT NULL DEFAULT 5,
        "totalCopies" integer NOT NULL DEFAULT 1,
        "availableCopies" integer NOT NULL DEFAULT 1,
        "isActive" boolean NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "categoryId" integer
      )
    `);

    // Create book_copies table
    await queryRunner.query(`
      CREATE TABLE "book_copies" (
        "id" SERIAL PRIMARY KEY,
        "copyNumber" character varying NOT NULL,
        "barcode" character varying NOT NULL UNIQUE,
        "condition" character varying NOT NULL DEFAULT 'new',
        "location" character varying NOT NULL DEFAULT 'main-shelf',
        "status" character varying NOT NULL DEFAULT 'available',
        "purchaseDate" TIMESTAMP,
        "lastMaintenanceDate" TIMESTAMP,
        "notes" text,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "bookId" integer
      )
    `);

    // Create loans table
    await queryRunner.query(`
      CREATE TABLE "loans" (
        "id" SERIAL PRIMARY KEY,
        "loanDate" TIMESTAMP NOT NULL DEFAULT now(),
        "dueDate" TIMESTAMP NOT NULL,
        "returnDate" TIMESTAMP,
        "status" character varying NOT NULL DEFAULT 'active',
        "renewalCount" integer NOT NULL DEFAULT 0,
        "notes" text,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "bookCopyId" integer,
        "studentId" integer,
        "loanedById" integer,
        "returnedById" integer
      )
    `);

    // Create reservations table
    await queryRunner.query(`
      CREATE TABLE "reservations" (
        "id" SERIAL PRIMARY KEY,
        "reservationDate" TIMESTAMP NOT NULL DEFAULT now(),
        "expiryDate" TIMESTAMP NOT NULL,
        "status" character varying NOT NULL DEFAULT 'pending',
        "notificationSent" boolean NOT NULL DEFAULT false,
        "fulfilledDate" TIMESTAMP,
        "cancelledDate" TIMESTAMP,
        "notes" text,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "bookId" integer,
        "studentId" integer
      )
    `);

    // Create reading_activities table
    await queryRunner.query(`
      CREATE TABLE "reading_activities" (
        "id" SERIAL PRIMARY KEY,
        "activityType" character varying NOT NULL,
        "activityDate" TIMESTAMP NOT NULL DEFAULT now(),
        "duration" integer,
        "pagesRead" integer,
        "comprehensionScore" integer,
        "feedback" text,
        "pointsEarned" integer NOT NULL DEFAULT 0,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "studentId" integer,
        "loanId" integer,
        "recordedById" integer,
        CONSTRAINT "CHK_reading_activities_comprehensionScore" CHECK ("comprehensionScore" IS NULL OR ("comprehensionScore" >= 0 AND "comprehensionScore" <= 100))
      )
    `);

    // Create points_transactions table
    await queryRunner.query(`
      CREATE TABLE "points_transactions" (
        "id" SERIAL PRIMARY KEY,
        "transactionType" character varying NOT NULL,
        "points" integer NOT NULL,
        "reason" character varying NOT NULL,
        "description" text,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "studentId" integer,
        "issuedById" integer,
        "readingActivityId" integer
      )
    `);

    // Create audit_logs table
    await queryRunner.query(`
      CREATE TABLE "audit_logs" (
        "id" SERIAL PRIMARY KEY,
        "action" character varying NOT NULL,
        "entityType" character varying NOT NULL,
        "entityId" integer NOT NULL,
        "changes" jsonb,
        "ipAddress" character varying,
        "userAgent" character varying,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "userId" integer
      )
    `);

    // Add foreign key constraints
    await queryRunner.query(`
      ALTER TABLE "users" 
      ADD CONSTRAINT "FK_users_role" 
      FOREIGN KEY ("roleId") REFERENCES "roles"("id") 
      ON DELETE SET NULL ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "students" 
      ADD CONSTRAINT "FK_students_class" 
      FOREIGN KEY ("classId") REFERENCES "classes"("id") 
      ON DELETE SET NULL ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "books" 
      ADD CONSTRAINT "FK_books_category" 
      FOREIGN KEY ("categoryId") REFERENCES "categories"("id") 
      ON DELETE SET NULL ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "book_copies" 
      ADD CONSTRAINT "FK_book_copies_book" 
      FOREIGN KEY ("bookId") REFERENCES "books"("id") 
      ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "loans" 
      ADD CONSTRAINT "FK_loans_bookCopy" 
      FOREIGN KEY ("bookCopyId") REFERENCES "book_copies"("id") 
      ON DELETE SET NULL ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "loans" 
      ADD CONSTRAINT "FK_loans_student" 
      FOREIGN KEY ("studentId") REFERENCES "students"("id") 
      ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "loans" 
      ADD CONSTRAINT "FK_loans_loanedBy" 
      FOREIGN KEY ("loanedById") REFERENCES "users"("id") 
      ON DELETE SET NULL ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "loans" 
      ADD CONSTRAINT "FK_loans_returnedBy" 
      FOREIGN KEY ("returnedById") REFERENCES "users"("id") 
      ON DELETE SET NULL ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "reservations" 
      ADD CONSTRAINT "FK_reservations_book" 
      FOREIGN KEY ("bookId") REFERENCES "books"("id") 
      ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "reservations" 
      ADD CONSTRAINT "FK_reservations_student" 
      FOREIGN KEY ("studentId") REFERENCES "students"("id") 
      ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "reading_activities" 
      ADD CONSTRAINT "FK_reading_activities_student" 
      FOREIGN KEY ("studentId") REFERENCES "students"("id") 
      ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "reading_activities" 
      ADD CONSTRAINT "FK_reading_activities_loan" 
      FOREIGN KEY ("loanId") REFERENCES "loans"("id") 
      ON DELETE SET NULL ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "reading_activities" 
      ADD CONSTRAINT "FK_reading_activities_recordedBy" 
      FOREIGN KEY ("recordedById") REFERENCES "users"("id") 
      ON DELETE SET NULL ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "points_transactions" 
      ADD CONSTRAINT "FK_points_transactions_student" 
      FOREIGN KEY ("studentId") REFERENCES "students"("id") 
      ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "points_transactions" 
      ADD CONSTRAINT "FK_points_transactions_issuedBy" 
      FOREIGN KEY ("issuedById") REFERENCES "users"("id") 
      ON DELETE SET NULL ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "points_transactions" 
      ADD CONSTRAINT "FK_points_transactions_readingActivity" 
      FOREIGN KEY ("readingActivityId") REFERENCES "reading_activities"("id") 
      ON DELETE SET NULL ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "audit_logs" 
      ADD CONSTRAINT "FK_audit_logs_user" 
      FOREIGN KEY ("userId") REFERENCES "users"("id") 
      ON DELETE SET NULL ON UPDATE NO ACTION
    `);

    // Create indexes for performance
    await queryRunner.query(`CREATE INDEX "IDX_users_username" ON "users" ("username")`);
    await queryRunner.query(`CREATE INDEX "IDX_users_email" ON "users" ("email")`);
    await queryRunner.query(`CREATE INDEX "IDX_students_studentId" ON "students" ("studentId")`);
    await queryRunner.query(`CREATE INDEX "IDX_books_isbn" ON "books" ("isbn")`);
    await queryRunner.query(`CREATE INDEX "IDX_book_copies_barcode" ON "book_copies" ("barcode")`);
    await queryRunner.query(`CREATE INDEX "IDX_loans_status" ON "loans" ("status")`);
    await queryRunner.query(`CREATE INDEX "IDX_reservations_status" ON "reservations" ("status")`);
    await queryRunner.query(`CREATE INDEX "IDX_audit_logs_entityType_entityId" ON "audit_logs" ("entityType", "entityId")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign keys first
    await queryRunner.query(`ALTER TABLE "audit_logs" DROP CONSTRAINT "FK_audit_logs_user"`);
    await queryRunner.query(`ALTER TABLE "points_transactions" DROP CONSTRAINT "FK_points_transactions_readingActivity"`);
    await queryRunner.query(`ALTER TABLE "points_transactions" DROP CONSTRAINT "FK_points_transactions_issuedBy"`);
    await queryRunner.query(`ALTER TABLE "points_transactions" DROP CONSTRAINT "FK_points_transactions_student"`);
    await queryRunner.query(`ALTER TABLE "reading_activities" DROP CONSTRAINT "FK_reading_activities_recordedBy"`);
    await queryRunner.query(`ALTER TABLE "reading_activities" DROP CONSTRAINT "FK_reading_activities_loan"`);
    await queryRunner.query(`ALTER TABLE "reading_activities" DROP CONSTRAINT "FK_reading_activities_student"`);
    await queryRunner.query(`ALTER TABLE "reservations" DROP CONSTRAINT "FK_reservations_student"`);
    await queryRunner.query(`ALTER TABLE "reservations" DROP CONSTRAINT "FK_reservations_book"`);
    await queryRunner.query(`ALTER TABLE "loans" DROP CONSTRAINT "FK_loans_returnedBy"`);
    await queryRunner.query(`ALTER TABLE "loans" DROP CONSTRAINT "FK_loans_loanedBy"`);
    await queryRunner.query(`ALTER TABLE "loans" DROP CONSTRAINT "FK_loans_student"`);
    await queryRunner.query(`ALTER TABLE "loans" DROP CONSTRAINT "FK_loans_bookCopy"`);
    await queryRunner.query(`ALTER TABLE "book_copies" DROP CONSTRAINT "FK_book_copies_book"`);
    await queryRunner.query(`ALTER TABLE "books" DROP CONSTRAINT "FK_books_category"`);
    await queryRunner.query(`ALTER TABLE "students" DROP CONSTRAINT "FK_students_class"`);
    await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_users_role"`);

    // Drop indexes
    await queryRunner.query(`DROP INDEX "IDX_audit_logs_entityType_entityId"`);
    await queryRunner.query(`DROP INDEX "IDX_reservations_status"`);
    await queryRunner.query(`DROP INDEX "IDX_loans_status"`);
    await queryRunner.query(`DROP INDEX "IDX_book_copies_barcode"`);
    await queryRunner.query(`DROP INDEX "IDX_books_isbn"`);
    await queryRunner.query(`DROP INDEX "IDX_students_studentId"`);
    await queryRunner.query(`DROP INDEX "IDX_users_email"`);
    await queryRunner.query(`DROP INDEX "IDX_users_username"`);

    // Drop tables in reverse order
    await queryRunner.query(`DROP TABLE "audit_logs"`);
    await queryRunner.query(`DROP TABLE "points_transactions"`);
    await queryRunner.query(`DROP TABLE "reading_activities"`);
    await queryRunner.query(`DROP TABLE "reservations"`);
    await queryRunner.query(`DROP TABLE "loans"`);
    await queryRunner.query(`DROP TABLE "book_copies"`);
    await queryRunner.query(`DROP TABLE "books"`);
    await queryRunner.query(`DROP TABLE "categories"`);
    await queryRunner.query(`DROP TABLE "students"`);
    await queryRunner.query(`DROP TABLE "classes"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "roles"`);
  }
}
