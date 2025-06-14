import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core';

import { uuidV7, uuidV7Nullable } from 'saas-shared-drizzle-util';

export const orgs = pgTable('organization', {
  id: uuidV7('id').primaryKey(),
  name: text('name'),
});

export const users = pgTable(
  'users',
  {
    id: uuidV7('id').primaryKey(),
    email: text('email').notNull().unique(),
    passwordHash: text('passwordHash').notNull(),
    passwordSalt: text('passwordSalt').notNull(),
  },
  table => [uniqueIndex('email_idx').on(table.email)],
);

export const addresses = pgTable('addresses', {
  id: uuidV7('id').primaryKey(),
  countryCode: text('countryCode').notNull(),
});

export const orgMemberRoleEnum = pgEnum('orgMemberRoleEnum', [
  'ADMIN',
  'MANAGER',
  'EMPLOYEE',
]);

export const orgMembers = pgTable('orgMembers', {
  id: uuidV7('id').primaryKey(),
  userId: uuidV7('userId').references(() => users.id, { onDelete: 'cascade' }),
  orgId: uuidV7('orgId').references(() => orgs.id, { onDelete: 'cascade' }),
  role: orgMemberRoleEnum('role').notNull().default('MANAGER'),
});

export const engagementTypeEnum = pgEnum('employmentTypeEnum', [
  'CONTRACT',
  'PERMANENT',
  'OUT_STAFF',
]);

export const commitmentTypeEnum = pgEnum('commitmentTypeEnum', [
  'FULL_TIME',
  'PART_TIME',
]);

export const employeeProfiles = pgTable('employeeProfile', {
  id: uuidV7('id'),
  userId: uuidV7('userId').references(() => users.id, { onDelete: 'cascade' }),
  jobId: uuidV7('jobId').references(() => jobs.id, { onDelete: 'cascade' }),
  startedAt: timestamp('startedAt').notNull(),
  endedAt: timestamp('startedAt'),
  skillsetId: uuidV7Nullable('skillsetId').references(() => skillsets.id, {
    onDelete: 'set null',
  }),
  engagementType: engagementTypeEnum('engagementType').notNull(),
  commitmentType: commitmentTypeEnum('commitmentType').notNull(),
});

export const jobs = pgTable('jobs', {
  id: uuidV7('id').primaryKey(),
  title: text('jobTitle').notNull(),
});

export const jobTypeEnum = pgEnum('jobTypeEnum', [
  'ON_SITE',
  'REMOTE',
  'HYBRID',
]);

export const jobPosts = pgTable('jobPosts', {
  id: uuidV7('id').primaryKey(),
  title: text('jobTitle').notNull(),
  text: text('text').notNull(),
  skillsetId: uuidV7Nullable('skillsetId').references(() => skillsets.id, {
    onDelete: 'set null',
  }),
  engagementType: engagementTypeEnum('engagementType').notNull(),
  commitmentType: commitmentTypeEnum('commitmentType').notNull(),
  createdAt: timestamp().notNull().defaultNow(),
  location: text('location').notNull(),
});

export const skillTypeEnum = pgEnum('skillTypeEnum', ['SOFT', 'TECHNICAL']);

export const skills = pgTable('skills', {
  id: uuidV7('id').primaryKey(),
  label: varchar('label', { length: 255 }).notNull().unique(),
  description: text('description'),
  type: skillTypeEnum('type').notNull().default('TECHNICAL'),
});

export const skillsets = pgTable('skillsets', {
  id: uuidV7('id').primaryKey(),
});

export const skillsetSkills = pgTable('skillsetSkills', {
  id: uuidV7('id').primaryKey(),
  skillId: uuidV7('skillId').references(() => skills.id, {
    onDelete: 'cascade',
  }),
  skillsetId: uuidV7('skillsetId').references(() => skillsets.id, {
    onDelete: 'cascade',
  }),
  experienceMonths: integer('experienceMonths'),
  isEssential: boolean('isEssential').notNull().default(false),
});

export const candidateProfiles = pgTable('candidateProfiles', {
  id: uuidV7('id').primaryKey(),
  userId: uuidV7('userId').references(() => users.id, { onDelete: 'cascade' }),
  skillsetId: uuidV7Nullable('skillsetId').references(() => skillsets.id, {
    onDelete: 'set null',
  }),
});
