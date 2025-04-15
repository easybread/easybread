import { type CommandHandler } from '@easybread/core';

import { BreezyAuthStrategy } from '../breezy.auth-strategy';
import { BREEZY_COMMAND_NAME } from '../breezy.command-name';
import { type BreezyOrganizationSearchCommand } from '../commands';
import { breezyCompanyAdapter } from '../data-adapters';
import { BreezyCompany } from '../interfaces';

export const BreezyOrganizationSearchHandler: CommandHandler<
  BreezyOrganizationSearchCommand,
  BreezyAuthStrategy
> = {
  name: BREEZY_COMMAND_NAME.HR_ORGANIZATION_SEARCH,

  async handle(input, context) {
    const result = await context.httpRequest<BreezyCompany[]>({
      method: 'GET',
      url: 'https://api.breezy.hr/v3/companies',
    });

    return {
      breadId: input.breadId,
      success: true,
      pagination: { type: 'DISABLED' },
      payload: result.data.map(breezyCompanyAdapter.toInternal),
      rawPayload: result.data,
    };
  },
};
