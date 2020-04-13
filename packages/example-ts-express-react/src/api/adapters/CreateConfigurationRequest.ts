import { Request } from 'express';

import { SetupBambooDto, SetupGoogleDto } from '../../dtos';

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
