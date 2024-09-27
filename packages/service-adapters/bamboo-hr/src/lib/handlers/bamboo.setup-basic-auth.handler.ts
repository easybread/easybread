import { BreadOperationHandler, createSuccessfulOutput } from '@easybread/core';
import { BreadOperationName } from '@easybread/operations';

import { BambooHrAuthStrategy } from '../bamboo-hr.auth-strategy';
import type { BambooHrSetupBasicAuthOperation } from '../bamboo-hr.operation';

export const BambooSetupBasicAuthHandler: BreadOperationHandler<
  BambooHrSetupBasicAuthOperation,
  BambooHrAuthStrategy
> = {
  name: BreadOperationName.SETUP_BASIC_AUTH,

  async handle(input, context) {
    await context.auth.authenticate(input.breadId, input.payload);
    return createSuccessfulOutput(BreadOperationName.SETUP_BASIC_AUTH);
  },
};
