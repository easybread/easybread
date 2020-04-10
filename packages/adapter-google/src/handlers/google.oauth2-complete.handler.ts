import { BreadOperationHandler } from '@easybread/core';

import { GoogleAuthStrategy } from '../google.auth-strategy';
import { GoogleOperationName } from '../google.operation-name';
import { GoogleOauth2CompleteOperation } from '../operations';

export const GoogleOauth2CompleteHandler: BreadOperationHandler<
  GoogleOauth2CompleteOperation,
  GoogleAuthStrategy
> = {
  name: GoogleOperationName.AUTH_FLOW_COMPLETE,
  async handle(input, context) {
    const data = await context.auth.authenticate(input.breadId, input.payload);

    return {
      name: GoogleOperationName.AUTH_FLOW_COMPLETE,
      rawPayload: { data, success: true }
    };
  }
};
