import { Request } from 'express';

import { ADAPTER_NAME } from '../../../common';
import { CompleteGoogleOauth2Dto, CompleteGsuiteAdminOauth2Dto } from '../dtos';

type CompleteGoogleOAuthRequest = Request<
  { adapter: ADAPTER_NAME.GOOGLE_CONTACTS },
  unknown,
  CompleteGoogleOauth2Dto
>;
type CompleteGSuiteAdminOAuthRequest = Request<
  { adapter: ADAPTER_NAME.GSUITE_ADMIN },
  unknown,
  CompleteGsuiteAdminOauth2Dto
>;

export type CompleteAuthRequest =
  | CompleteGoogleOAuthRequest
  | CompleteGSuiteAdminOAuthRequest;

// GUARDS

export const isCompleteGoogleOAuthRequest = (
  req: CompleteAuthRequest
): req is CompleteGoogleOAuthRequest => {
  return req.params.adapter === ADAPTER_NAME.GOOGLE_CONTACTS;
};

export const isCompleteGSuiteAdminOAuthRequest = (
  req: CompleteAuthRequest
): req is CompleteGoogleOAuthRequest => {
  return req.params.adapter === ADAPTER_NAME.GSUITE_ADMIN;
};
