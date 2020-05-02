import { Request } from 'express';

import { SetupBambooDto, SetupGoogleDto } from '../dtos';

type SetupGoogleRequest = Request<
  { adapter: 'google' },
  unknown,
  SetupGoogleDto
>;

type SetupBambooRequest = Request<
  { adapter: 'bamboo' },
  unknown,
  SetupBambooDto
>;

export type CreateConfigurationRequest =
  | SetupBambooRequest
  | SetupGoogleRequest;

// Guards
export const isSetupBambooRequest = (
  req: CreateConfigurationRequest
): req is SetupBambooRequest => {
  return req.params.adapter === 'bamboo';
};

export const isSetupGoogleRequest = (
  req: CreateConfigurationRequest
): req is SetupGoogleRequest => {
  return req.params.adapter === 'google';
};
