import { Request } from 'express';

import { ADAPTER_NAME } from '../../../common';

export type PeopleDeleteRequest = Request<
  { adapter: ADAPTER_NAME; id: string },
  { id: string }
>;
