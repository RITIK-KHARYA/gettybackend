/*
  Warnings:

  - Made the column `banner` on table `space` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "space" ALTER COLUMN "banner" SET NOT NULL;
