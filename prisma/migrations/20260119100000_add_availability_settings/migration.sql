-- CreateTable
CREATE TABLE "availability_settings" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "startTime" TEXT NOT NULL DEFAULT '08:00',
    "endTime" TEXT NOT NULL DEFAULT '17:00',
    "slotDurationMinutes" INTEGER NOT NULL DEFAULT 30,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "availability_settings_pkey" PRIMARY KEY ("id")
);

-- Add new columns to appointments table
ALTER TABLE "appointments" ADD COLUMN "bookedAt" TIMESTAMP(3);
ALTER TABLE "appointments" ADD COLUMN "bookedEndAt" TIMESTAMP(3);

-- Migrate existing appointments: copy slot times to bookedAt/bookedEndAt
UPDATE "appointments" a
SET "bookedAt" = s."startAt", "bookedEndAt" = s."endAt"
FROM "appointment_slots" s
WHERE a."slotId" = s."id";

-- Make bookedAt required after migration (with default for safety)
ALTER TABLE "appointments" ALTER COLUMN "bookedAt" SET NOT NULL;
ALTER TABLE "appointments" ALTER COLUMN "bookedEndAt" SET NOT NULL;

-- Make slotId optional (nullable)
ALTER TABLE "appointments" DROP CONSTRAINT IF EXISTS "appointments_slotId_fkey";
ALTER TABLE "appointments" ALTER COLUMN "slotId" DROP NOT NULL;

-- Re-add foreign key as optional
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_slotId_fkey" FOREIGN KEY ("slotId") REFERENCES "appointment_slots"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Create index on bookedAt
CREATE INDEX "appointments_bookedAt_idx" ON "appointments"("bookedAt");

-- Insert default availability settings
INSERT INTO "availability_settings" ("id", "startTime", "endTime", "slotDurationMinutes", "updatedAt")
VALUES ('default', '08:00', '17:00', 30, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO NOTHING;
