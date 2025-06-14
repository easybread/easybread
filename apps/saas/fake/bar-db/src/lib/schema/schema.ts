import { relations } from 'drizzle-orm';
import {
  boolean,
  decimal,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

import { uuidV7 } from 'saas-shared-drizzle-util';

import {
  applicationStatusEnum,
  type employmentTypeEnum,
  interviewStatusEnum,
  jobStatusEnum,
  userRoleEnum,
} from './enums';

export const users = pgTable('users', {
  id: uuidV7('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  firstName: varchar('firstName', { length: 100 }).notNull(),
  lastName: varchar('lastName', { length: 100 }).notNull(),
  role: userRoleEnum('role').notNull().default('RECRUITER'),
  isActive: boolean('isActive').notNull().default(true),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  jobPostings: many(jobPostings),
  interviews: many(interviews),
}));

export const usersIndexes = {
  roleIdx: index('users_role_idx').on(users.role),
  isActiveIdx: index('users_is_active_idx').on(users.isActive),
};

export const jobPostings = pgTable('jobPostings', {
  id: uuidV7('id').primaryKey(),
  title: varchar('title', { length: 200 }).notNull(),
  description: text('description').notNull(),
  requirements: text('requirements'),
  hiringManagerId: uuidV7('hiringManagerId').notNull(),
  employmentType: employmentTypeEnum('employmentType').notNull(),
  location: varchar('location', { length: 100 }),
  isRemote: boolean('isRemote').notNull().default(false),
  salary: decimal('salary', { precision: 10, scale: 2 }),
  status: jobStatusEnum('status').notNull().default('DRAFT'),
  postedAt: timestamp('postedAt'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

export const jobPostingsRelations = relations(jobPostings, ({ one, many }) => ({
  hiringManager: one(users, {
    fields: [jobPostings.hiringManagerId],
    references: [users.id],
  }),
  applications: many(applications),
}));

export const jobPostingsIndexes = {
  hiringManagerIdx: index('job_postings_hiring_manager_idx').on(
    jobPostings.hiringManagerId,
  ),
  statusIdx: index('job_postings_status_idx').on(jobPostings.status),
  postedAtIdx: index('job_postings_posted_at_idx').on(jobPostings.postedAt),
  employmentTypeIdx: index('job_postings_employment_type_idx').on(
    jobPostings.employmentType,
  ),
  isRemoteIdx: index('job_postings_is_remote_idx').on(jobPostings.isRemote),
};

export const candidates = pgTable('candidates', {
  id: uuidV7('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  firstName: varchar('firstName', { length: 100 }).notNull(),
  lastName: varchar('lastName', { length: 100 }).notNull(),
  phone: varchar('phone', { length: 20 }),
  resumeUrl: text('resumeUrl'),
  location: varchar('location', { length: 100 }),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

export const candidatesRelations = relations(candidates, ({ many }) => ({
  applications: many(applications),
}));

export const candidatesIndexes = {
  locationIdx: index('candidates_location_idx').on(candidates.location),
};

export const employees = pgTable('employees', {
  id: uuidV7('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  firstName: varchar('firstName', { length: 100 }).notNull(),
  lastName: varchar('lastName', { length: 100 }).notNull(),
  position: varchar('position', { length: 200 }).notNull(),
  employmentType: employmentTypeEnum('employmentType').notNull(),
  startDate: timestamp('startDate').notNull(),
  endDate: timestamp('endDate'),
  salary: decimal('salary', { precision: 10, scale: 2 }),
  location: varchar('location', { length: 100 }),
  isRemote: boolean('isRemote').notNull().default(false),
  isActive: boolean('isActive').notNull().default(true),
  hiredFromApplicationId: uuidV7('hiredFromApplicationId'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

export const employeesRelations = relations(employees, ({ one }) => ({
  hiredFromApplication: one(applications, {
    fields: [employees.hiredFromApplicationId],
    references: [applications.id],
  }),
}));

export const employeesIndexes = {
  positionIdx: index('employees_position_idx').on(employees.position),
  startDateIdx: index('employees_start_date_idx').on(employees.startDate),
  isActiveIdx: index('employees_is_active_idx').on(employees.isActive),
  employmentTypeIdx: index('employees_employment_type_idx').on(
    employees.employmentType,
  ),
  hiredFromApplicationIdx: index('employees_hired_from_application_idx').on(
    employees.hiredFromApplicationId,
  ),
};

export const applications = pgTable('applications', {
  id: uuidV7('id').primaryKey(),
  candidateId: uuidV7('candidateId').notNull(),
  jobPostingId: uuidV7('jobPostingId').notNull(),
  status: applicationStatusEnum('status').notNull().default('APPLIED'),
  coverLetter: text('coverLetter'),
  resumeUrl: text('resumeUrl'),
  appliedAt: timestamp('appliedAt').notNull().defaultNow(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

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
    interviews: many(interviews),
    hiredEmployee: one(employees, {
      fields: [applications.id],
      references: [employees.hiredFromApplicationId],
    }),
  }),
);

export const applicationsIndexes = {
  candidateIdx: index('applications_candidate_idx').on(
    applications.candidateId,
  ),
  jobPostingIdx: index('applications_job_posting_idx').on(
    applications.jobPostingId,
  ),
  statusIdx: index('applications_status_idx').on(applications.status),
  appliedAtIdx: index('applications_applied_at_idx').on(applications.appliedAt),
  jobStatusIdx: index('applications_job_status_idx').on(
    applications.jobPostingId,
    applications.status,
  ),
};

export const interviews = pgTable('interviews', {
  id: uuidV7('id').primaryKey(),
  applicationId: uuidV7('applicationId').notNull(),
  interviewerId: uuidV7('interviewerId').notNull(),
  scheduledAt: timestamp('scheduledAt').notNull(),
  location: text('location'),
  status: interviewStatusEnum('status').notNull().default('SCHEDULED'),
  feedback: text('feedback'),
  rating: integer('rating'), // 1-5 scale
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
});

export const interviewsRelations = relations(interviews, ({ one }) => ({
  application: one(applications, {
    fields: [interviews.applicationId],
    references: [applications.id],
  }),
  interviewer: one(users, {
    fields: [interviews.interviewerId],
    references: [users.id],
  }),
}));

export const interviewsIndexes = {
  applicationIdx: index('interviews_application_idx').on(
    interviews.applicationId,
  ),
  interviewerIdx: index('interviews_interviewer_idx').on(
    interviews.interviewerId,
  ),
  scheduledAtIdx: index('interviews_scheduled_at_idx').on(
    interviews.scheduledAt,
  ),
  statusIdx: index('interviews_status_idx').on(interviews.status),
};
