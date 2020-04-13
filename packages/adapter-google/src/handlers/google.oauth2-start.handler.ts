import { BreadOperationHandler } from '@easybread/core';

import { GoogleAuthStrategy } from '../google.auth-strategy';
import { GoogleOperationName } from '../google.operation-name';
import { GoogleOauth2StartOperation } from '../operations';

export const GoogleOauth2StartHandler: BreadOperationHandler<
  GoogleOauth2StartOperation,
  GoogleAuthStrategy
> = {
  name: GoogleOperationName.AUTH_FLOW_START,

  async handle(input, context) {
    const authUri = await context.auth.createAuthUri(
      input.breadId,
      input.payload
    );
    return {
      name: GoogleOperationName.AUTH_FLOW_START,
      rawPayload: {
        success: true,
        data: { authUri }
      }
    };
  }
};
