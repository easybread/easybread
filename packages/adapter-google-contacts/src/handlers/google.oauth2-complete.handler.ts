import { BreadOperationHandler } from '@easybread/core';
import {
  GoogleCommonOauth2CompleteOperation,
  GoogleCommonOperationName
} from '@easybread/google-common';

import { GoogleAuthStrategy } from '../google.auth-strategy';

export const GoogleOauth2CompleteHandler: BreadOperationHandler<
  GoogleCommonOauth2CompleteOperation,
  GoogleAuthStrategy
> = {
  name: GoogleCommonOperationName.AUTH_FLOW_COMPLETE,
  async handle(input, context) {
    const data = await context.auth.authenticate(input.breadId, input.payload);

    return {
      name: this.name,
      rawPayload: { data, success: true }
    };
  }
};
