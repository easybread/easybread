import { propTupleFromArray } from '@space-architects/util-ts';
import { pgEnum } from 'drizzle-orm/pg-core';

import { COUNTRIES } from '../constants/COUNTRIES';

export const countryCodeEnum = pgEnum(
  'countryCodeEnum',
  propTupleFromArray(COUNTRIES, 'code'),
);

export const orgMemberRoleEnum = pgEnum('orgMemberRoleEnum', [
  'ADMIN',
  'MANAGER',
  'EMPLOYEE',
  'CANDIDATE',
]);

export const engagementTypeEnum = pgEnum('employmentTypeEnum', [
  'CONTRACT',
  'PERMANENT',
  'OUT_STAFF',
]);

export const commitmentTypeEnum = pgEnum('commitmentTypeEnum', [
  'FULL_TIME',
  'PART_TIME',
]);

export const jobTypeEnum = pgEnum('jobTypeEnum', [
  'ON_SITE',
  'REMOTE',
  'HYBRID',
]);

export const skillTypeEnum = pgEnum('skillTypeEnum', ['SOFT', 'TECHNICAL']);

export const genderEnum = pgEnum('genderEnum', ['MALE', 'FEMALE']);

export const jobApplicationStatusEnum = pgEnum('jobApplicationStatusEnum', [
  'PENDING',
  'SHORTLISTED',
  'INTERVIEW',
  'OFFER',
  'HIRED',
  'REJECTED_BY_EMPLOYER',
  'REJECTED_BY_CANDIDATE',
  'CANCELLED',
]);
