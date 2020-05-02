import { Request } from 'express';

import { ADAPTER_NAME } from '../../../common';

export type PeopleRequest = Request<{ adapter: ADAPTER_NAME }>;
