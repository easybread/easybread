import { Request } from 'express';

import { CompleteGoogleOauth2Dto } from '../dtos';

type CompleteGoogleOAuthRequest = Request<
  { adapter: 'google' },
  unknown,
  CompleteGoogleOauth2Dto
>;

export type CompleteAuthRequest = CompleteGoogleOAuthRequest;

// GUARDS

export const isCompleteGoogleOAuthRequest = (
  req: CompleteAuthRequest
): req is CompleteGoogleOAuthRequest => {
  return req.params.adapter === 'google';
};
