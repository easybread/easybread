import { type CommandPaginated, PAGINATION_TYPE } from '@easybread/core';
import type { ApplyActionSchema, SearchActionSchema } from '@easybread/schemas';

import type { BAMBOO_HR_COMMAND_NAME } from '../bamboo-hr.command-name';
import type { BambooApplicationList } from '../interfaces';

export type BambooJobApplicationSearchCommand = CommandPaginated<
  typeof PAGINATION_TYPE.CURSOR,
  typeof BAMBOO_HR_COMMAND_NAME.HR_JOB_APPLICATION_SEARCH,
  SearchActionSchema,
  ApplyActionSchema[],
  BambooApplicationList
>;
