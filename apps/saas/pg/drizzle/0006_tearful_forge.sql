CREATE TYPE "public"."connection_type" AS ENUM('DB_PG', 'DB_MYSQL', 'DB_MONGO', 'EB_ADAPTER');--> statement-breakpoint
CREATE TABLE "connection_settings" (
	"id" uuid PRIMARY KEY NOT NULL,
	"connectionId" uuid NOT NULL,
	"value" jsonb NOT NULL
);
--> statement-breakpoint
ALTER TABLE "organizations" ALTER COLUMN "name" SET DEFAULT 'Default';--> statement-breakpoint
ALTER TABLE "connections" ADD COLUMN "type" "connection_type" NOT NULL;--> statement-breakpoint
ALTER TABLE "connection_settings" ADD CONSTRAINT "connection_settings_connectionId_connections_id_fk" FOREIGN KEY ("connectionId") REFERENCES "public"."connections"("id") ON DELETE cascade ON UPDATE no action;