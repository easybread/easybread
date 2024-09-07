import {
  BreadOperationHandler,
  createSuccessfulOutputWithRawData,
} from '@easybread/core';

import { GoogleCommonOauth2AuthStrategy } from '../google-common.oauth2.auth-strategy';
import {
  GoogleCommonOauth2StartOperation,
  GoogleCommonOperationName,
} from '../operations';

export const GoogleCommonOauth2StartHandler: BreadOperationHandler<
  GoogleCommonOauth2StartOperation,
  GoogleCommonOauth2AuthStrategy
> = {
  name: GoogleCommonOperationName.AUTH_FLOW_START,

  async handle(input, context) {
    const authUri = await context.auth.createAuthUri(
      input.breadId,
      input.payload
    );

    return createSuccessfulOutputWithRawData(this.name, { authUri });
  },
};
