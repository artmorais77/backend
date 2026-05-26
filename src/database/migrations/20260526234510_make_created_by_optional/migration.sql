-- DropForeignKey
ALTER TABLE "companies" DROP CONSTRAINT "FK_created_by_user_company";

-- DropForeignKey
ALTER TABLE "roles" DROP CONSTRAINT "FK_created_by_user_role";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "FK_created_by_user";

-- AlterTable
ALTER TABLE "companies" ALTER COLUMN "created_by" DROP NOT NULL;

-- AlterTable
ALTER TABLE "roles" ALTER COLUMN "created_by" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "created_by" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "companies" ADD CONSTRAINT "FK_created_by_user_company" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "FK_created_by_user" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roles" ADD CONSTRAINT "FK_created_by_user_role" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
