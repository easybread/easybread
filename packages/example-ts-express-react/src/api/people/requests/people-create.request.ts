import { PersonSchema } from '@easybread/schemas';
import { Request } from 'express';

import { ADAPTER_NAME } from '../../../common';

export type PeopleCreateRequest = Request<
  { adapter: ADAPTER_NAME },
  unknown,
  PersonSchema
>;
