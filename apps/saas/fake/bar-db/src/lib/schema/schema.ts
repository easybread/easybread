import { relations } from 'drizzle-orm';
import {
  boolean,
  decimal,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

import { uuidV7 } from 'saas-shared-drizzle-util';

// Enums
export const jobStatusEnum = pgEnum('jobStatus', [
  'draft',
  'active',
  'paused',
  'closed',
  'cancelled',
]);
export const applicationStatusEnum = pgEnum('applicationStatus', [
  'applied',
  'screening',
  'interviewing',
  'offer',
  'hired',
  'rejected',
  'withdrawn',
]);
export const interviewTypeEnum = pgEnum('interviewType', [
  'phone',
  'video',
  'onsite',
  'technical',
  'cultural',
]);
export const interviewStatusEnum = pgEnum('interviewStatus', [
  'scheduled',
  'completed',
  'cancelled',
  'no_show',
]);
export const employmentTypeEnum = pgEnum('employmentType', [
  'full_time',
  'part_time',
  'contract',
  'internship',
  'temporary',
]);
export const experienceLevelEnum = pgEnum('experienceLevel', [
  'entry',
  'junior',
  'mid',
  'senior',
  'lead',
  'executive',
]);
export const userRoleEnum = pgEnum('userRole', [
  'admin',
  'recruiter',
  'hiring_manager',
  'interviewer',
]);

export const entityTypeEnum = pgEnum('entityType', [
  'candidate',
  'employee',
  'application',
  'interview',
  'job_posting',
  'department',
  'user',
]);

// Core Tables
export const users = pgTable('users', {
  id: uuidV7('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  firstName: varchar('firstName', { length: 100 }).notNull(),
  lastName: varchar('lastName', { length: 100 }).notNull(),
  role: userRoleEnum('role').notNull().default('recruiter'),
  departmentId: uuidV7('departmentId'),
  isActive: boolean('isActive').notNull().default(true),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

export const departments = pgTable('departments', {
  id: uuidV7('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  managerId: uuidV7('managerId'),
  isActive: boolean('isActive').notNull().default(true),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
});

export const jobPostings = pgTable('jobPostings', {
  id: uuidV7('id').primaryKey(),
  title: varchar('title', { length: 200 }).notNull(),
  description: text('description').notNull(),
  requirements: text('requirements'),
  responsibilities: text('responsibilities'),
  departmentId: uuidV7('departmentId').notNull(),
  hiringManagerId: uuidV7('hiringManagerId').notNull(),
  employmentType: employmentTypeEnum('employmentType').notNull(),
  experienceLevel: experienceLevelEnum('experienceLevel').notNull(),
  location: varchar('location', { length: 100 }),
  isRemote: boolean('isRemote').notNull().default(false),
  salaryMin: decimal('salaryMin', { precision: 10, scale: 2 }),
  salaryMax: decimal('salaryMax', { precision: 10, scale: 2 }),
  status: jobStatusEnum('status').notNull().default('draft'),
  openingsCount: integer('openingsCount').notNull().default(1),
  postedAt: timestamp('postedAt'),
  closesAt: timestamp('closesAt'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

export const candidates = pgTable('candidates', {
  id: uuidV7('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  firstName: varchar('firstName', { length: 100 }).notNull(),
  lastName: varchar('lastName', { length: 100 }).notNull(),
  phone: varchar('phone', { length: 20 }),
  resumeUrl: text('resumeUrl'),
  linkedinUrl: text('linkedinUrl'),
  portfolioUrl: text('portfolioUrl'),
  currentPosition: varchar('currentPosition', { length: 200 }),
  currentCompany: varchar('currentCompany', { length: 100 }),
  yearsOfExperience: integer('yearsOfExperience'),
  expectedSalary: decimal('expectedSalary', { precision: 10, scale: 2 }),
  location: varchar('location', { length: 100 }),
  isOpenToRemote: boolean('isOpenToRemote').notNull().default(false),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

export const employees = pgTable('employees', {
  id: uuidV7('id').primaryKey(),
  employeeId: varchar('employeeId', { length: 50 }).notNull().unique(), // Company employee number
  email: varchar('email', { length: 255 }).notNull().unique(),
  firstName: varchar('firstName', { length: 100 }).notNull(),
  lastName: varchar('lastName', { length: 100 }).notNull(),
  phone: varchar('phone', { length: 20 }),
  dateOfBirth: timestamp('dateOfBirth'),
  position: varchar('position', { length: 200 }).notNull(),
  departmentId: uuidV7('departmentId').notNull(),
  managerId: uuidV7('managerId'), // Direct manager (another employee)
  employmentType: employmentTypeEnum('employmentType').notNull(),
  experienceLevel: experienceLevelEnum('experienceLevel').notNull(),
  startDate: timestamp('startDate').notNull(),
  endDate: timestamp('endDate'), // If terminated
  salary: decimal('salary', { precision: 10, scale: 2 }),
  salaryEffectiveDate: timestamp('salaryEffectiveDate'),
  location: varchar('location', { length: 100 }),
  isRemote: boolean('isRemote').notNull().default(false),
  isActive: boolean('isActive').notNull().default(true),
  hiredFromApplicationId: uuidV7('hiredFromApplicationId'), // Link to original application if hired through system
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

export const applications = pgTable('applications', {
  id: uuidV7('id').primaryKey(),
  candidateId: uuidV7('candidateId').notNull(),
  jobPostingId: uuidV7('jobPostingId').notNull(),
  status: applicationStatusEnum('status').notNull().default('applied'),
  coverLetter: text('coverLetter'),
  resumeUrl: text('resumeUrl'),
  appliedAt: timestamp('appliedAt').notNull().defaultNow(),
  assignedToId: uuidV7('assignedToId'),
  currentStageId: uuidV7('currentStageId'),
  rating: integer('rating'), // 1-5 scale
  rejectionReason: text('rejectionReason'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

export const interviewStages = pgTable('interviewStages', {
  id: uuidV7('id').primaryKey(),
  jobPostingId: uuidV7('jobPostingId').notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  order: integer('order').notNull(),
  interviewType: interviewTypeEnum('interviewType').notNull(),
  durationMinutes: integer('durationMinutes').notNull().default(60),
  isRequired: boolean('isRequired').notNull().default(true),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
});

export const interviews = pgTable('interviews', {
  id: uuidV7('id').primaryKey(),
  applicationId: uuidV7('applicationId').notNull(),
  stageId: uuidV7('stageId').notNull(),
  interviewerId: uuidV7('interviewerId').notNull(),
  scheduledAt: timestamp('scheduledAt').notNull(),
  scheduledEndAt: timestamp('scheduledEndAt').notNull(),
  actualStartAt: timestamp('actualStartAt'),
  actualEndAt: timestamp('actualEndAt'),
  location: text('location'),
  meetingUrl: text('meetingUrl'),
  status: interviewStatusEnum('status').notNull().default('scheduled'),
  feedback: text('feedback'),
  rating: integer('rating'), // 1-5 scale
  recommendation: varchar('recommendation', { length: 50 }), // hire, no_hire, maybe
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

export const applicationStageHistory = pgTable('applicationStageHistory', {
  id: uuidV7('id').primaryKey(),
  applicationId: uuidV7('applicationId').notNull(),
  fromStatus: applicationStatusEnum('fromStatus'),
  toStatus: applicationStatusEnum('toStatus').notNull(),
  changedById: uuidV7('changedById').notNull(),
  reason: text('reason'),
  changedAt: timestamp('changedAt').notNull().defaultNow(),
});

export const notes = pgTable('notes', {
  id: uuidV7('id').primaryKey(),
  entityType: entityTypeEnum('entityType').notNull(),
  entityId: uuidV7('entityId').notNull(),
  content: text('content').notNull(),
  category: varchar('category', { length: 50 }), // e.g., 'feedback', 'general', 'concern'
  isPrivate: boolean('isPrivate').notNull().default(false),
  createdById: uuidV7('createdById').notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

// Relations
export const notesRelations = relations(notes, ({ one }) => ({
  createdBy: one(users, {
    fields: [notes.createdById],
    references: [users.id],
  }),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
  department: one(departments, {
    fields: [users.departmentId],
    references: [departments.id],
  }),
  managedDepartment: one(departments, {
    fields: [users.id],
    references: [departments.managerId],
  }),
  jobPostings: many(jobPostings),
  assignedApplications: many(applications),
  interviews: many(interviews),
  stageChanges: many(applicationStageHistory),
  createdNotes: many(notes),
}));

export const departmentsRelations = relations(departments, ({ one, many }) => ({
  manager: one(users, {
    fields: [departments.managerId],
    references: [users.id],
  }),
  users: many(users),
  jobPostings: many(jobPostings),
  employees: many(employees),
}));

export const jobPostingsRelations = relations(jobPostings, ({ one, many }) => ({
  department: one(departments, {
    fields: [jobPostings.departmentId],
    references: [departments.id],
  }),
  hiringManager: one(users, {
    fields: [jobPostings.hiringManagerId],
    references: [users.id],
  }),
  applications: many(applications),
  interviewStages: many(interviewStages),
}));

export const candidatesRelations = relations(candidates, ({ many }) => ({
  applications: many(applications),
}));

export const employeesRelations = relations(employees, ({ one, many }) => ({
  department: one(departments, {
    fields: [employees.departmentId],
    references: [departments.id],
  }),
  manager: one(employees, {
    fields: [employees.managerId],
    references: [employees.id],
  }),
  directReports: many(employees),
  hiredFromApplication: one(applications, {
    fields: [employees.hiredFromApplicationId],
    references: [applications.id],
  }),
}));

export const applicationsRelations = relations(
  applications,
  ({ one, many }) => ({
    candidate: one(candidates, {
      fields: [applications.candidateId],
      references: [candidates.id],
    }),
    jobPosting: one(jobPostings, {
      fields: [applications.jobPostingId],
      references: [jobPostings.id],
    }),
    assignedTo: one(users, {
      fields: [applications.assignedToId],
      references: [users.id],
    }),
    currentStage: one(interviewStages, {
      fields: [applications.currentStageId],
      references: [interviewStages.id],
    }),
    interviews: many(interviews),
    stageHistory: many(applicationStageHistory),
    hiredEmployee: one(employees, {
      fields: [applications.id],
      references: [employees.hiredFromApplicationId],
    }),
  }),
);

export const interviewStagesRelations = relations(
  interviewStages,
  ({ one, many }) => ({
    jobPosting: one(jobPostings, {
      fields: [interviewStages.jobPostingId],
      references: [jobPostings.id],
    }),
    interviews: many(interviews),
    applications: many(applications),
  }),
);

export const interviewsRelations = relations(interviews, ({ one }) => ({
  application: one(applications, {
    fields: [interviews.applicationId],
    references: [applications.id],
  }),
  stage: one(interviewStages, {
    fields: [interviews.stageId],
    references: [interviewStages.id],
  }),
  interviewer: one(users, {
    fields: [interviews.interviewerId],
    references: [users.id],
  }),
}));

export const applicationStageHistoryRelations = relations(
  applicationStageHistory,
  ({ one }) => ({
    application: one(applications, {
      fields: [applicationStageHistory.applicationId],
      references: [applications.id],
    }),
    changedBy: one(users, {
      fields: [applicationStageHistory.changedById],
      references: [users.id],
    }),
  }),
);
