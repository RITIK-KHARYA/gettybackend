/*
  Warnings:

  - A unique constraint covering the columns `[backgroundMediaId]` on the table `space` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('IMAGE', 'VIDEO');

-- AlterTable
ALTER TABLE "space" ADD COLUMN     "backgroundMediaId" TEXT,
ADD COLUMN     "banner" TEXT;

-- CreateTable
CREATE TABLE "media" (
    "id" TEXT NOT NULL,
    "type" "MediaType" NOT NULL,
    "url" TEXT NOT NULL,
    "spaceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "media_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "media_spaceId_type_url_key" ON "media"("spaceId", "type", "url");

-- CreateIndex
CREATE UNIQUE INDEX "space_backgroundMediaId_key" ON "space"("backgroundMediaId");

-- AddForeignKey
ALTER TABLE "space" ADD CONSTRAINT "space_backgroundMediaId_fkey" FOREIGN KEY ("backgroundMediaId") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE CASCADE;
