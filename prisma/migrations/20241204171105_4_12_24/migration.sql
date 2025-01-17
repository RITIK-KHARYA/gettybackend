-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('LIKE');

-- CreateTable
CREATE TABLE "notification" (
    "id" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "receipentid" TEXT NOT NULL,
    "issuerid" TEXT NOT NULL,

    CONSTRAINT "notification_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_receipentid_fkey" FOREIGN KEY ("receipentid") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_issuerid_fkey" FOREIGN KEY ("issuerid") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
