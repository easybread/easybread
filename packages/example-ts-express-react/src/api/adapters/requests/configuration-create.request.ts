import { Request } from 'express';

import { ADAPTER_NAME } from '../../../common';
import { SetupBambooDto, SetupGoogleDto } from '../dtos';

type SetupGoogleRequest = Request<
  { adapter: ADAPTER_NAME.GOOGLE },
  unknown,
  SetupGoogleDto
>;

type SetupBambooRequest = Request<
  { adapter: ADAPTER_NAME.BAMBOO },
  unknown,
  SetupBambooDto
>;

export type ConfigurationCreateRequest =
  | SetupBambooRequest
  | SetupGoogleRequest;

// Guards
export const isSetupBambooRequest = (
  req: ConfigurationCreateRequest
): req is SetupBambooRequest => {
  return req.params.adapter === ADAPTER_NAME.BAMBOO;
};

export const isSetupGoogleRequest = (
  req: ConfigurationCreateRequest
): req is SetupGoogleRequest => {
  return req.params.adapter === ADAPTER_NAME.GOOGLE;
};
