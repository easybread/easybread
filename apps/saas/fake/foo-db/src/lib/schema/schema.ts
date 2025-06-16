import { uuidV7, uuidV7Nullable } from '@space-architects/util-drizzle';
import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core';

import {
  commitmentTypeEnum,
  countryCodeEnum,
  engagementTypeEnum,
  jobTypeEnum,
  orgMemberRoleEnum,
  skillTypeEnum,
} from './enums';

export const orgs = pgTable('organization', {
  id: uuidV7('id').primaryKey(),
  name: text('name'),
});

export const departments = pgTable('departments', {
  id: uuidV7('id').primaryKey(),
  name: text('name').notNull(),
  orgId: uuidV7('orgId').references(() => orgs.id, { onDelete: 'cascade' }),
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
  street1: text('street1'),
  street2: text('street2'),
  city: text('city'),
  state: text('state'),
  postalCode: text('postalCode'),
  countryCode: countryCodeEnum('countryCode').notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

export const orgMembers = pgTable('orgMembers', {
  id: uuidV7('id').primaryKey(),
  userId: uuidV7('userId').references(() => users.id, { onDelete: 'cascade' }),
  orgId: uuidV7('orgId').references(() => orgs.id, { onDelete: 'cascade' }),
  role: orgMemberRoleEnum('role').notNull().default('MANAGER'),
});

export const employeeProfiles = pgTable('employeeProfile', {
  id: uuidV7('id'),
  userId: uuidV7('userId').references(() => users.id, { onDelete: 'cascade' }),
  startedAt: timestamp('startedAt').notNull(),
  endedAt: timestamp('startedAt'),
  skillsetId: uuidV7Nullable('skillsetId').references(() => skillsets.id, {
    onDelete: 'set null',
  }),
  jobTitle: text('jobTitle').notNull(),
  engagementType: engagementTypeEnum('engagementType').notNull(),
  commitmentType: commitmentTypeEnum('commitmentType').notNull(),
  addressId: uuidV7Nullable('addressId').references(() => addresses.id, {
    onDelete: 'set null',
  }),
  departmentId: uuidV7Nullable('departmentId').references(
    () => departments.id,
    { onDelete: 'set null' },
  ),
});

export const jobPosts = pgTable('jobPosts', {
  id: uuidV7('id').primaryKey(),
  title: text('jobTitle').notNull(),
  text: text('text').notNull(),
  skillsetId: uuidV7Nullable('skillsetId').references(() => skillsets.id, {
    onDelete: 'set null',
  }),
  jobType: jobTypeEnum('jobType').notNull(),
  engagementType: engagementTypeEnum('engagementType').notNull(),
  commitmentType: commitmentTypeEnum('commitmentType').notNull(),
  createdAt: timestamp().notNull().defaultNow(),
  addressesId: uuidV7Nullable('addressesId').references(() => addresses.id, {
    onDelete: 'set null',
  }),
  minSalary: integer('minSalary'),
  maxSalary: integer('maxSalary'),
  currency: varchar('currency', { length: 10 }).notNull().default('USD'),
});

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
  cvUrl: text('cvUrl'),
  skillsetId: uuidV7Nullable('skillsetId').references(() => skillsets.id, {
    onDelete: 'set null',
  }),
  addressesId: uuidV7Nullable('addressesId').references(() => addresses.id, {
    onDelete: 'set null',
  }),
});

export const workHistoryItems = pgTable('workHistoryItems', {
  id: uuidV7('id').primaryKey(),
  order: integer('order'),
  candidateProfileId: uuidV7('candidateProfileId').references(
    () => candidateProfiles.id,
    { onDelete: 'cascade' },
  ),
  startedAt: timestamp('startedAt').notNull(),
  endedAt: timestamp('endedAt'),
  title: text('title').notNull(),
  description: text('description'),
  companyName: text('companyName').notNull(),
  addressId: uuidV7Nullable('addressesId').references(() => addresses.id, {
    onDelete: 'set null',
  }),
  engagementType: engagementTypeEnum('engagementType').notNull(),
  commitmentType: commitmentTypeEnum('commitmentType').notNull(),
  jobType: jobTypeEnum('jobType').notNull(),
});
