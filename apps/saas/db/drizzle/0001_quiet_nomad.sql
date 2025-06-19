CREATE TABLE "connections" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
