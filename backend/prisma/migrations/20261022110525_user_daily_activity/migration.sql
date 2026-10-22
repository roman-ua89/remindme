-- CreateTable
CREATE TABLE "user_daily_activity" (
    "user_id" UUID NOT NULL,
    "activity_date" DATE NOT NULL,
    "revised_count" INTEGER NOT NULL DEFAULT 0,
    "skipped_count" INTEGER NOT NULL DEFAULT 0,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "user_daily_activity_pkey" PRIMARY KEY ("user_id","activity_date")
);

-- AddForeignKey
ALTER TABLE "user_daily_activity" ADD CONSTRAINT "user_daily_activity_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
