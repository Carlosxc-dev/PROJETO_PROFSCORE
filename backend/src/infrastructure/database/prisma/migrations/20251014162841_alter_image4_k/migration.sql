-- AlterTable
ALTER TABLE "images_4k" ADD COLUMN     "user_id" TEXT;

-- AddForeignKey
ALTER TABLE "images_4k" ADD CONSTRAINT "images_4k_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
