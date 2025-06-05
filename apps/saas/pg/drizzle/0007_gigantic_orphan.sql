ALTER TABLE "sessions" ADD COLUMN "memberOf" jsonb;--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "defaultOrg" text;