import { PersonSchema } from '@easybread/schemas';
import { Request } from 'express';

import { ADAPTER_NAME } from '../../../common';

export type PeopleUpdateRequest = Request<
  { adapter: ADAPTER_NAME; id: string },
  unknown,
  PersonSchema
>;
