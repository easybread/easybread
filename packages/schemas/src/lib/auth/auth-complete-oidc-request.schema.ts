import type { Simplify } from '@easybread/common';

import type { AuthBaseSchema } from './auth-base.schema';

export type AuthCompleteOidcRequestSchema = Simplify<
  AuthBaseSchema & {
    '@type': 'CompleteOIDCRequest';
    code: string;
    state: string;
  }
>;
