ALTER TABLE "connections" ALTER COLUMN "type" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."connection_type";--> statement-breakpoint
CREATE TYPE "public"."connection_type" AS ENUM('DB_PG', 'DB_MYSQL', 'DB_MONGO', 'EB_BREEZY', 'EB_BAMBOO', 'EB_GOOGLE_ADMIN_DIRECTORY', 'EB_GOOGLE_CONTACTS');--> statement-breakpoint
ALTER TABLE "connections" ALTER COLUMN "type" SET DATA TYPE "public"."connection_type" USING "type"::"public"."connection_type";