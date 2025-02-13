import {
  type BreadOperationHandler,
  createSuccessfulOutputWithRawData,
} from '@easybread/core';

import type { BambooHrAuthStrategy } from '../bamboo-hr.auth-strategy';
import { BambooHrOperationName } from '../bamboo-hr.operation-name';
import type { BambooHrOidcAuthStartOperation } from '../operations';

export const BambooOidcAuthStartHandler: BreadOperationHandler<
  BambooHrOidcAuthStartOperation,
  BambooHrAuthStrategy
> = {
  name: BambooHrOperationName.OIDC_AUTH_START,

  async handle(input, context) {
    const { breadId, payload } = input;

    const authUri = await context.auth.createOidcAuthUri(breadId, payload);

    return createSuccessfulOutputWithRawData(this.name, { authUri });
  },
};
