import { BreadOperationHandler } from '@easybread/core';
import {
  GoogleCommonOauth2StartOperation,
  GoogleCommonOperationName
} from '@easybread/google-common';

import { GoogleAuthStrategy } from '../google.auth-strategy';
import { GoogleContactsAuthScopes } from '../interfaces';

export const GoogleOauth2StartHandler: BreadOperationHandler<
  GoogleCommonOauth2StartOperation<GoogleContactsAuthScopes>,
  GoogleAuthStrategy
> = {
  name: GoogleCommonOperationName.AUTH_FLOW_START,

  async handle(input, context) {
    const authUri = await context.auth.createAuthUri(
      input.breadId,
      input.payload
    );

    return {
      name: this.name,
      rawPayload: {
        success: true,
        data: { authUri }
      }
    };
  }
};
