-- AlterTable
ALTER TABLE "users" ADD COLUMN     "availableCredits" INTEGER NOT NULL DEFAULT 10,
ADD COLUMN     "lastCreditRefillAt" TIMESTAMP(3),
ADD COLUMN     "totalCredits" INTEGER NOT NULL DEFAULT 10;
