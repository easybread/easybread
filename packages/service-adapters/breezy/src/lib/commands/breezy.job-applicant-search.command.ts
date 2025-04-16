import { type CommandPaginated, PAGINATION_TYPE } from '@easybread/core';
import type { PersonSchema } from '@easybread/schemas';

import type { BREEZY_COMMAND_NAME } from '../breezy.command-name';
import type { BreezyCandidate } from '../interfaces';

export type BreezyJobApplicantSearchCommand = CommandPaginated<
  typeof PAGINATION_TYPE.DISABLED,
  typeof BREEZY_COMMAND_NAME.HR_JOB_APPLICANT_SEARCH,
  null,
  PersonSchema[],
  BreezyCandidate[]
>;
