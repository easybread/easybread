CREATE TYPE "public"."dataModelInstrospectionStatusEnum" AS ENUM('PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED');--> statement-breakpoint
CREATE TABLE "dataModelEntities" (
	"dataModelId" uuid NOT NULL,
	"name" text NOT NULL,
	"namespace" text NOT NULL,
	"def" jsonb NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "dataModelEntities_dataModelId_namespace_name_pk" PRIMARY KEY("dataModelId","namespace","name")
);
--> statement-breakpoint
CREATE TABLE "dataModelEnums" (
	"dataModelId" uuid NOT NULL,
	"name" text NOT NULL,
	"namespace" text NOT NULL,
	"def" jsonb NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "dataModelEnums_dataModelId_namespace_name_pk" PRIMARY KEY("dataModelId","namespace","name")
);
--> statement-breakpoint
CREATE TABLE "dataModelInstrospections" (
	"id" uuid PRIMARY KEY NOT NULL,
	"status" "dataModelInstrospectionStatusEnum" DEFAULT 'PENDING' NOT NULL,
	"dataModelId" uuid NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "dataModelRelations" (
	"dataModelId" uuid NOT NULL,
	"relationId" text NOT NULL,
	"def" jsonb NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "dataModelRelations_dataModelId_relationId_pk" PRIMARY KEY("dataModelId","relationId")
);
--> statement-breakpoint
CREATE TABLE "dataModels" (
	"id" uuid PRIMARY KEY NOT NULL,
	"orgId" uuid NOT NULL,
	"connectionId" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"namespaces" jsonb NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "dataModelEntities" ADD CONSTRAINT "dataModelEntities_dataModelId_dataModels_id_fk" FOREIGN KEY ("dataModelId") REFERENCES "public"."dataModels"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dataModelEnums" ADD CONSTRAINT "dataModelEnums_dataModelId_dataModels_id_fk" FOREIGN KEY ("dataModelId") REFERENCES "public"."dataModels"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dataModelInstrospections" ADD CONSTRAINT "dataModelInstrospections_dataModelId_dataModels_id_fk" FOREIGN KEY ("dataModelId") REFERENCES "public"."dataModels"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dataModelRelations" ADD CONSTRAINT "dataModelRelations_dataModelId_dataModels_id_fk" FOREIGN KEY ("dataModelId") REFERENCES "public"."dataModels"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dataModels" ADD CONSTRAINT "dataModels_orgId_organizations_id_fk" FOREIGN KEY ("orgId") REFERENCES "public"."organizations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "dataModels" ADD CONSTRAINT "dataModels_connectionId_connections_id_fk" FOREIGN KEY ("connectionId") REFERENCES "public"."connections"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "data_model_entities_namespace_name_idx" ON "dataModelEntities" USING btree ("namespace","name");--> statement-breakpoint
CREATE INDEX "data_model_enums_namespace_name_idx" ON "dataModelEnums" USING btree ("namespace","name");--> statement-breakpoint
CREATE INDEX "data_model_instrospections_data_model_id_status_idx" ON "dataModelInstrospections" USING btree ("dataModelId","status");--> statement-breakpoint
CREATE INDEX "data_model_relations_relation_id_idx" ON "dataModelRelations" USING btree ("relationId");--> statement-breakpoint
CREATE INDEX "data_models_org_id_connection_id_name_idx" ON "dataModels" USING btree ("orgId","connectionId");--> statement-breakpoint
CREATE UNIQUE INDEX "data_models_connection_id_org_id_unique" ON "dataModels" USING btree ("connectionId","orgId");