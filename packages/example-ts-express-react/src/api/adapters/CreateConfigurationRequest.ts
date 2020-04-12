import { Request } from 'express';

import { SetupBambooDto } from '../../dtos';

export type CreateConfigurationRequest = Request<
  { adapter: 'bamboo' },
  unknown,
  SetupBambooDto
>| Request<
  { adapter: 'google' },
  unknown,
  SetupBambooDto
>;
