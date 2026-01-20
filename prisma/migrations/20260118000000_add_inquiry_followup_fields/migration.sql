-- Add follow-up details to contact inquiries
ALTER TABLE "contact_inquiries"
ADD COLUMN "supplierAddress" TEXT,
ADD COLUMN "estimatedBudget" TEXT,
ADD COLUMN "otherSites" TEXT,
ADD COLUMN "otherSiteLocations" TEXT,
ADD COLUMN "expectedDocuments" TEXT,
ADD COLUMN "regulatoryStandards" TEXT;
