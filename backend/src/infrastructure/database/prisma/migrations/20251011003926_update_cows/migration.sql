/*
  Warnings:

  - You are about to drop the column `date` on the `cows` table. All the data in the column will be lost.
  - Added the required column `id_folder` to the `cows` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url_image` to the `cows` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."cows" DROP CONSTRAINT "cows_feedlot_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."images_4k" DROP CONSTRAINT "images_4k_feedlot_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."users" DROP CONSTRAINT "users_farm_id_fkey";

-- AlterTable
ALTER TABLE "cows" DROP COLUMN "date",
ADD COLUMN     "id_folder" TEXT NOT NULL,
ADD COLUMN     "url_image" TEXT NOT NULL,
ALTER COLUMN "feedlot_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "images_4k" ALTER COLUMN "feedlot_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_farm_id_fkey" FOREIGN KEY ("farm_id") REFERENCES "farms"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cows" ADD CONSTRAINT "cows_feedlot_id_fkey" FOREIGN KEY ("feedlot_id") REFERENCES "feedlots"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "images_4k" ADD CONSTRAINT "images_4k_feedlot_id_fkey" FOREIGN KEY ("feedlot_id") REFERENCES "feedlots"("id") ON DELETE SET NULL ON UPDATE CASCADE;
