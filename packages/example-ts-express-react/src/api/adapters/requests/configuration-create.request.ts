import { Request } from 'express';

import { ADAPTER_NAME } from '../../../common';
import { SetupBambooDto, SetupGoogleDto, SetupGsuiteAdminDto } from '../dtos';

type SetupGoogleRequest = Request<
  { adapter: ADAPTER_NAME.GOOGLE_CONTACTS },
  unknown,
  SetupGoogleDto
>;

type SetupBambooRequest = Request<
  { adapter: ADAPTER_NAME.BAMBOO },
  unknown,
  SetupBambooDto
>;
type SetupGSuiteAdminRequest = Request<
  { adapter: ADAPTER_NAME.GSUITE_ADMIN },
  unknown,
  SetupGsuiteAdminDto
>;

export type ConfigurationCreateRequest =
  | SetupBambooRequest
  | SetupGoogleRequest
  | SetupGSuiteAdminRequest;

// Guards
export const isSetupBambooRequest = (
  req: ConfigurationCreateRequest
): req is SetupBambooRequest => {
  return req.params.adapter === ADAPTER_NAME.BAMBOO;
};

export const isSetupGoogleRequest = (
  req: ConfigurationCreateRequest
): req is SetupGoogleRequest => {
  return req.params.adapter === ADAPTER_NAME.GOOGLE_CONTACTS;
};

export const isSetupGsuiteAdminRequest = (
  req: ConfigurationCreateRequest
): req is SetupGSuiteAdminRequest => {
  return req.params.adapter === ADAPTER_NAME.GSUITE_ADMIN;
};
