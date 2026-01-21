-- CreateEnum
CREATE TYPE "BookingType" AS ENUM ('CLIENT', 'ADMIN', 'BLOCKED');

-- AlterTable
ALTER TABLE "appointments" ADD COLUMN     "bookingType" "BookingType" NOT NULL DEFAULT 'CLIENT';

-- CreateIndex
CREATE INDEX "appointments_bookingType_idx" ON "appointments"("bookingType");
