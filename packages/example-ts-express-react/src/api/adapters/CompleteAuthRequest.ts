import { Request } from 'express';

import { CompleteGoogleOauth2Dto } from '../../dtos';

type SetupGoogleRequest = Request<
  { adapter: 'google' },
  unknown,
  CompleteGoogleOauth2Dto
>;

export type CompleteAuthRequest = SetupGoogleRequest;
