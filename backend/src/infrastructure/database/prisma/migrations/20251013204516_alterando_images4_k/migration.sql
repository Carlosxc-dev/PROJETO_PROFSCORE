/*
  Warnings:

  - You are about to drop the column `url_image` on the `images_4k` table. All the data in the column will be lost.
  - Added the required column `idFolder` to the `images_4k` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalImagesRequest` to the `images_4k` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "images_4k" DROP COLUMN "url_image",
ADD COLUMN     "idFolder" TEXT NOT NULL,
ADD COLUMN     "totalImagesRequest" INTEGER NOT NULL;
