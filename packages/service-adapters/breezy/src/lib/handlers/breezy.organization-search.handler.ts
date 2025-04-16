import { type CommandHandler } from '@easybread/core';

import { BreezyAuthStrategy } from '../breezy.auth-strategy';
import { BREEZY_COMMAND_NAME } from '../breezy.command-name';
import { type BreezyOrganizationSearchCommand } from '../commands';
import { breezyCompanyAdapter } from '../data-adapters';

import { companyList } from './lib/company-list';

export const BreezyOrganizationSearchHandler: CommandHandler<
  BreezyOrganizationSearchCommand,
  BreezyAuthStrategy
> = {
  name: BREEZY_COMMAND_NAME.HR_ORGANIZATION_SEARCH,

  async handle(input, context) {
    const companies = await companyList(context);

    return {
      breadId: input.breadId,
      success: true,
      pagination: { type: 'DISABLED' },
      payload: companies.map(breezyCompanyAdapter.toInternal),
      rawPayload: companies,
    };
  },
};
