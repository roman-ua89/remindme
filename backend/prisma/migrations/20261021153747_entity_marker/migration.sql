-- AlterTable
ALTER TABLE "entities" ADD COLUMN     "marker" SMALLINT;

-- Marker values mirror ENTITY_MARKER in @remindme/contracts/entities
ALTER TABLE "entities" ADD CONSTRAINT "entities_marker_check" CHECK ("marker" IS NULL OR "marker" IN (1, 2));
