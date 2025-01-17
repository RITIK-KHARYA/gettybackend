/*
  Warnings:

  - You are about to drop the column `Mediatypo` on the `media` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `media` table. All the data in the column will be lost.
  - You are about to drop the column `backgroundMediaId` on the `space` table. All the data in the column will be lost.
  - You are about to drop the column `backgroundMediaUrl` on the `space` table. All the data in the column will be lost.
  - The `role` column on the `space_user` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[spaceId,Mediatype,url]` on the table `media` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `Mediatype` to the `media` table without a default value. This is not possible if the table is not empty.
  - Made the column `spaceId` on table `media` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'MEMEBER');

-- DropForeignKey
ALTER TABLE "media" DROP CONSTRAINT "media_spaceId_fkey";

-- DropForeignKey
ALTER TABLE "space" DROP CONSTRAINT "space_backgroundMediaId_fkey";

-- DropIndex
DROP INDEX "media_spaceId_Mediatypo_url_key";

-- DropIndex
DROP INDEX "space_backgroundMediaId_key";

-- AlterTable
ALTER TABLE "media" DROP COLUMN "Mediatypo",
DROP COLUMN "role",
ADD COLUMN     "Mediatype" "MediaType" NOT NULL,
ALTER COLUMN "spaceId" SET NOT NULL;

-- AlterTable
ALTER TABLE "space" DROP COLUMN "backgroundMediaId",
DROP COLUMN "backgroundMediaUrl";

-- AlterTable
ALTER TABLE "space_user" DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'MEMEBER';

-- DropEnum
DROP TYPE "MediaRole";

-- CreateIndex
CREATE UNIQUE INDEX "media_spaceId_Mediatype_url_key" ON "media"("spaceId", "Mediatype", "url");

-- AddForeignKey
ALTER TABLE "media" ADD CONSTRAINT "media_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "space"("id") ON DELETE CASCADE ON UPDATE CASCADE;
