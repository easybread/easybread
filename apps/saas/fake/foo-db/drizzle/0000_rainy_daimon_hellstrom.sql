CREATE TYPE "public"."commitmentTypeEnum" AS ENUM('FULL_TIME', 'PART_TIME');--> statement-breakpoint
CREATE TYPE "public"."employmentTypeEnum" AS ENUM('CONTRACT', 'PERMANENT', 'OUT_STAFF');--> statement-breakpoint
CREATE TYPE "public"."jobTypeEnum" AS ENUM('ON_SITE', 'REMOTE', 'HYBRID');--> statement-breakpoint
CREATE TYPE "public"."orgMemberRoleEnum" AS ENUM('ADMIN', 'MANAGER', 'EMPLOYEE');--> statement-breakpoint
CREATE TABLE "addresses" (
	"id" uuid PRIMARY KEY NOT NULL,
	"countryCode" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "candidateProfiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"userId" uuid NOT NULL,
	"skillsetId" uuid
);
--> statement-breakpoint
CREATE TABLE "employeeProfile" (
	"id" uuid NOT NULL,
	"userId" uuid NOT NULL,
	"jobId" uuid NOT NULL,
	"startedAt" timestamp,
	"skillsetId" uuid,
	"engagementType" "employmentTypeEnum" NOT NULL,
	"commitmentType" "commitmentTypeEnum" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "jobSkills" (
	"id" uuid PRIMARY KEY NOT NULL,
	"jobPostId" uuid NOT NULL,
	"skillId" uuid NOT NULL,
	"isEssential" boolean
);
--> statement-breakpoint
CREATE TABLE "jobPosts" (
	"id" uuid PRIMARY KEY NOT NULL,
	"jobTitle" text NOT NULL,
	"text" text NOT NULL,
	"skillsetId" uuid,
	"engagementType" "employmentTypeEnum" NOT NULL,
	"commitmentType" "commitmentTypeEnum" NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"location" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "jobs" (
	"id" uuid PRIMARY KEY NOT NULL,
	"jobTitle" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orgMembers" (
	"id" uuid PRIMARY KEY NOT NULL,
	"userId" uuid NOT NULL,
	"orgId" uuid NOT NULL,
	"role" "orgMemberRoleEnum" DEFAULT 'MANAGER' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "organization" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text
);
--> statement-breakpoint
CREATE TABLE "skills" (
	"id" uuid PRIMARY KEY NOT NULL,
	"label" text,
	CONSTRAINT "skills_label_unique" UNIQUE("label")
);
--> statement-breakpoint
CREATE TABLE "skillsetSkills" (
	"id" uuid PRIMARY KEY NOT NULL,
	"skillId" uuid NOT NULL,
	"skillsetId" uuid NOT NULL,
	"experience" integer,
	"isEssential" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "skillsets" (
	"id" uuid PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"passwordHash" text NOT NULL,
	"passwordSalt" text NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "candidateProfiles" ADD CONSTRAINT "candidateProfiles_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "candidateProfiles" ADD CONSTRAINT "candidateProfiles_skillsetId_skillsets_id_fk" FOREIGN KEY ("skillsetId") REFERENCES "public"."skillsets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "employeeProfile" ADD CONSTRAINT "employeeProfile_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "employeeProfile" ADD CONSTRAINT "employeeProfile_jobId_jobs_id_fk" FOREIGN KEY ("jobId") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "employeeProfile" ADD CONSTRAINT "employeeProfile_skillsetId_skillsets_id_fk" FOREIGN KEY ("skillsetId") REFERENCES "public"."skillsets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jobSkills" ADD CONSTRAINT "jobSkills_jobPostId_jobPosts_id_fk" FOREIGN KEY ("jobPostId") REFERENCES "public"."jobPosts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jobSkills" ADD CONSTRAINT "jobSkills_skillId_skills_id_fk" FOREIGN KEY ("skillId") REFERENCES "public"."skills"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jobPosts" ADD CONSTRAINT "jobPosts_skillsetId_skillsets_id_fk" FOREIGN KEY ("skillsetId") REFERENCES "public"."skillsets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orgMembers" ADD CONSTRAINT "orgMembers_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orgMembers" ADD CONSTRAINT "orgMembers_orgId_organization_id_fk" FOREIGN KEY ("orgId") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "skillsetSkills" ADD CONSTRAINT "skillsetSkills_skillId_skills_id_fk" FOREIGN KEY ("skillId") REFERENCES "public"."skills"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "skillsetSkills" ADD CONSTRAINT "skillsetSkills_skillsetId_skillsets_id_fk" FOREIGN KEY ("skillsetId") REFERENCES "public"."skillsets"("id") ON DELETE cascade ON UPDATE no action;