-- DropIndex
DROP INDEX "entities_topic_id_visibility_revised_count_idx";

-- AlterTable
ALTER TABLE "entities" ADD COLUMN     "schedule_count" INTEGER NOT NULL DEFAULT 0;

-- Backfill: existing entities keep their current Player ordering
UPDATE "entities" SET "schedule_count" = "revised_count";

-- CreateIndex
CREATE INDEX "entities_topic_id_visibility_schedule_count_idx" ON "entities"("topic_id", "visibility", "schedule_count");
