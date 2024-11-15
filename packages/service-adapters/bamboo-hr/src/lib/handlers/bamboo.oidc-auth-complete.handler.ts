import {
  type BreadOperationHandler,
  createSuccessfulOutputWithRawData,
} from '@easybread/core';
import type { BambooHrOidcAuthCompleteOperation } from '../operations';
import type { BambooHrAuthStrategy } from '../bamboo-hr.auth-strategy';
import { BambooHrOperationName } from '../bamboo-hr.operation-name';

export const BambooOidcAuthCompleteHandler: BreadOperationHandler<
  BambooHrOidcAuthCompleteOperation,
  BambooHrAuthStrategy
> = {
  name: BambooHrOperationName.OIDC_AUTH_COMPLETE,

  async handle(input, context) {
    const { code, state } = input.payload;

    const { companyName } = await context.auth.authenticateOidc(input.breadId, {
      code,
      state,
    });

    return createSuccessfulOutputWithRawData(this.name, { companyName });
  },
};
