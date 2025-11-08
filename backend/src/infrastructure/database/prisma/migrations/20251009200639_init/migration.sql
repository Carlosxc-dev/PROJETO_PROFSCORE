-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('admin', 'dev', 'client');

-- CreateEnum
CREATE TYPE "State" AS ENUM ('atipico', 'normal');

-- CreateEnum
CREATE TYPE "Position" AS ENUM ('ereto', 'deitado');

-- CreateEnum
CREATE TYPE "Access" AS ENUM ('ativo', 'negado');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "type" "UserType" NOT NULL,
    "access" "Access" NOT NULL DEFAULT 'ativo',
    "farm_id" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "farms" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "latitude" DECIMAL(20,15) NOT NULL,
    "longitude" DECIMAL(21,15) NOT NULL,
    "license" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "farms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feedlots" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "latitude" DECIMAL(20,15) NOT NULL,
    "longitude" DECIMAL(21,15) NOT NULL,
    "farm_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "feedlots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cows" (
    "id" TEXT NOT NULL,
    "state" "State" NOT NULL,
    "position" "Position" NOT NULL,
    "feedlot_id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "images_4k" (
    "id" TEXT NOT NULL,
    "latitude" DECIMAL(20,15) NOT NULL,
    "longitude" DECIMAL(21,15) NOT NULL,
    "url_image" TEXT NOT NULL,
    "feedlot_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "images_4k_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "farms_license_key" ON "farms"("license");

-- CreateIndex
CREATE INDEX "feedlots_farm_id_idx" ON "feedlots"("farm_id");

-- CreateIndex
CREATE INDEX "cows_feedlot_id_idx" ON "cows"("feedlot_id");

-- CreateIndex
CREATE INDEX "images_4k_feedlot_id_idx" ON "images_4k"("feedlot_id");

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_token_key" ON "refresh_tokens"("token");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_farm_id_fkey" FOREIGN KEY ("farm_id") REFERENCES "farms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedlots" ADD CONSTRAINT "feedlots_farm_id_fkey" FOREIGN KEY ("farm_id") REFERENCES "farms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cows" ADD CONSTRAINT "cows_feedlot_id_fkey" FOREIGN KEY ("feedlot_id") REFERENCES "feedlots"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "images_4k" ADD CONSTRAINT "images_4k_feedlot_id_fkey" FOREIGN KEY ("feedlot_id") REFERENCES "feedlots"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
