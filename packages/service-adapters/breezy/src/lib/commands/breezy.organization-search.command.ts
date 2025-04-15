import { type CommandPaginated, PAGINATION_TYPE } from '@easybread/core';
import type { OrganizationSchema } from '@easybread/schemas';

import { BREEZY_COMMAND_NAME } from '../breezy.command-name';
import type { BreezyCompany } from '../interfaces';

export type BreezyOrganizationSearchCommand = CommandPaginated<
  typeof PAGINATION_TYPE.DISABLED,
  typeof BREEZY_COMMAND_NAME.HR_ORGANIZATION_SEARCH,
  null,
  OrganizationSchema[],
  BreezyCompany[]
>;
