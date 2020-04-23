import { BreadOperationHandler } from '@easybread/core';
import {
  BreadOperationName,
  SetupBasicAuthOperation
} from '@easybread/operations';

import { BambooHrAuthStrategy } from '../bamboo-hr.auth-strategy';
import { BambooBasicAuthPayload } from '../interfaces';

export const BambooSetupBasicAuthHandler: BreadOperationHandler<
  SetupBasicAuthOperation<BambooBasicAuthPayload>,
  BambooHrAuthStrategy
> = {
  name: BreadOperationName.SETUP_BASIC_AUTH,

  async handle(input, context) {
    await context.auth.authenticate(input.breadId, input.payload);

    return {
      name: BreadOperationName.SETUP_BASIC_AUTH,
      rawPayload: { success: true }
    };
  }
};
