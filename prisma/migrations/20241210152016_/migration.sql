-- DropForeignKey
ALTER TABLE "space" DROP CONSTRAINT "space_backgroundMediaId_fkey";

-- AlterTable
ALTER TABLE "space" ADD COLUMN     "backgroundMediaUrl" TEXT;

-- AddForeignKey
ALTER TABLE "media" ADD CONSTRAINT "media_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "space"("id") ON DELETE SET NULL ON UPDATE CASCADE;
