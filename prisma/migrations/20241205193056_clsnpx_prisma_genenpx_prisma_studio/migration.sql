/*
  Warnings:

  - You are about to drop the column `content` on the `space` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "space" DROP CONSTRAINT "space_userid_fkey";

-- AlterTable
ALTER TABLE "space" DROP COLUMN "content";

-- CreateTable
CREATE TABLE "space_user" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "spaceId" TEXT NOT NULL,
    "role" TEXT,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "space_user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "space_user_userId_spaceId_key" ON "space_user"("userId", "spaceId");

-- AddForeignKey
ALTER TABLE "space_user" ADD CONSTRAINT "space_user_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "space_user" ADD CONSTRAINT "space_user_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "space"("id") ON DELETE CASCADE ON UPDATE CASCADE;
