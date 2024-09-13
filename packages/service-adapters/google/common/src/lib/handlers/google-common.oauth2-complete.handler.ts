import {
  BreadOperationHandler,
  createSuccessfulOutputWithRawData,
} from '@easybread/core';

import { GoogleCommonOauth2AuthStrategy } from '../google-common.oauth2.auth-strategy';
import {
  GoogleCommonOauth2CompleteOperation,
  GoogleCommonOperationName,
} from '../operations';

export const GoogleCommonOauth2CompleteHandler: BreadOperationHandler<
  GoogleCommonOauth2CompleteOperation,
  GoogleCommonOauth2AuthStrategy
> = {
  name: GoogleCommonOperationName.AUTH_FLOW_COMPLETE,
  async handle(input, context) {
    const data = await context.auth.authenticate(input.breadId, input.payload);
    return createSuccessfulOutputWithRawData(this.name, data);
  },
};
