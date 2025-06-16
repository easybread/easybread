import { enumObject, enumSuiteObject } from '@space-architects/util-enum';

import { jobStatusEnum } from '../schema/enums';

export const JOB_STATUS_ENUM_SUITE = enumSuiteObject(
  enumObject(jobStatusEnum.enumValues),
);

export type JobStatusEnum = typeof JOB_STATUS_ENUM_SUITE.$type;
