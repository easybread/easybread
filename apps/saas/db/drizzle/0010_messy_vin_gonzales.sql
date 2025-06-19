DROP TABLE "connection_settings" CASCADE;--> statement-breakpoint
ALTER TABLE "connections" ADD COLUMN "value" jsonb;--> statement-breakpoint
ALTER TABLE "connections" ADD COLUMN "isConnected" boolean DEFAULT false NOT NULL;