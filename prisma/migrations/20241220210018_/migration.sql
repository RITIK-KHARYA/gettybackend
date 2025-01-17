/*
  Warnings:

  - You are about to drop the column `type` on the `media` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[spaceId,Mediatypo,url]` on the table `media` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `Mediatypo` to the `media` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role` to the `media` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MediaRole" AS ENUM ('PROFILE', 'BANNER', 'SPACEENTITY');

-- DropIndex
DROP INDEX "media_spaceId_type_url_key";

-- AlterTable
ALTER TABLE "media" DROP COLUMN "type",
ADD COLUMN     "Mediatypo" "MediaType" NOT NULL,
ADD COLUMN     "role" "MediaRole" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "media_spaceId_Mediatypo_url_key" ON "media"("spaceId", "Mediatypo", "url");

-- AddForeignKey
ALTER TABLE "space" ADD CONSTRAINT "space_backgroundMediaId_fkey" FOREIGN KEY ("backgroundMediaId") REFERENCES "media"("id") ON DELETE SET NULL ON UPDATE CASCADE;
