import { Request } from 'express';

import { ADAPTER_NAME } from '../../../common';

export type ConfigurationDeleteRequest = Request<{ adapter: ADAPTER_NAME }>;
