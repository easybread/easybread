import { BreadOperationHandler } from '@easybread/core';
import {
  GoogleCommonOauth2CompleteOperation,
  GoogleCommonOperationName
} from '@easybread/google-common';

import { GoogleContactsAuthStrategy } from '../google-contacts.auth-strategy';

export const GoogleContactsOauth2CompleteHandler: BreadOperationHandler<
  GoogleCommonOauth2CompleteOperation,
  GoogleContactsAuthStrategy
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
