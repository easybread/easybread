export const jobStatusEnum = pgEnum('jobStatus', ['DRAFT', 'ACTIVE', 'CLOSED']);

export const applicationStatusEnum = pgEnum('applicationStatus', [
  'APPLIED',
  'SCREENING',
  'INTERVIEWING',
  'OFFER',
  'HIRED',
  'REJECTED',
]);

export const interviewStatusEnum = pgEnum('interviewStatus', [
  'SCHEDULED',
  'COMPLETED',
  'CANCELLED',
]);

export const employmentTypeEnum = pgEnum('employmentType', [
  'FULL_TIME',
  'PART_TIME',
  'CONTRACT',
  'INTERNSHIP',
]);

export const userRoleEnum = pgEnum('userRole', [
  'ADMIN',
  'RECRUITER',
  'HIRING_MANAGER',
]);
