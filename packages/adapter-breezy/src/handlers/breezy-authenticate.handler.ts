import {
  BreadOperationHandler,
  createSuccessfulOutputWithRawData
} from '@easybread/core';

import { BreezyAuthStrategy } from '../breezy.auth-strategy';
import { BreezyOperationName } from '../breezy.operation-name';
import { BreezyAuthenticateOperation } from '../operations';

export const BreezyAuthenticateHandler: BreadOperationHandler<
  BreezyAuthenticateOperation,
  BreezyAuthStrategy
> = {
  name: BreezyOperationName.AUTHENTICATE,

  async handle(input, context) {
    const { breadId, payload } = input;

    const result = await context.auth.authenticate(breadId, payload);

    return createSuccessfulOutputWithRawData(
      BreezyOperationName.AUTHENTICATE,
      result
    );
  }
};
