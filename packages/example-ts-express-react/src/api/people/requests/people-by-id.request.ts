import { Request } from 'express';

import { ADAPTER_NAME } from '../../../common';
import { PeopleByIdResponseDto } from '../dtos';

export type PeopleByIdRequest = Request<
  { adapter: ADAPTER_NAME; id: string },
  PeopleByIdResponseDto
>;
