-- CreateEnum
CREATE TYPE "StatusRequest" AS ENUM ('COMPLETED', 'PROCESSING', 'FAILED');

-- AlterTable
ALTER TABLE "images_4k" ADD COLUMN     "statusRequest" TEXT NOT NULL DEFAULT 'PROCESSING';
