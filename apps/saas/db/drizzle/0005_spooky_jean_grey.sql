ALTER TABLE "connections" DROP CONSTRAINT "connections_userId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "connections" ADD COLUMN "organizationId" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "connections" ADD CONSTRAINT "connections_organizationId_organizations_id_fk" FOREIGN KEY ("organizationId") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "connections" DROP COLUMN "userId";