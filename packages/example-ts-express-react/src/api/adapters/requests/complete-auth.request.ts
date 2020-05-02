import { Request } from 'express';

import { ADAPTER_NAME } from '../../../common';
import { CompleteGoogleOauth2Dto } from '../dtos';

type CompleteGoogleOAuthRequest = Request<
  { adapter: ADAPTER_NAME.GOOGLE },
  unknown,
  CompleteGoogleOauth2Dto
>;

export type CompleteAuthRequest = CompleteGoogleOAuthRequest;

// GUARDS

export const isCompleteGoogleOAuthRequest = (
  req: CompleteAuthRequest
): req is CompleteGoogleOAuthRequest => {
  return req.params.adapter === ADAPTER_NAME.GOOGLE;
};
