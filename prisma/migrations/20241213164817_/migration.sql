/*
  Warnings:

  - You are about to drop the column `spaceId` on the `space` table. All the data in the column will be lost.
  - Made the column `backgroundMediaId` on table `space` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "space" DROP COLUMN "spaceId",
ALTER COLUMN "backgroundMediaId" SET NOT NULL;
