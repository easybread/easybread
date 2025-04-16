import type { Simplify } from '@easybread/common';

import type { AuthBaseSchema } from './auth-base.schema';

export type AuthStartOidcResponseSchema = Simplify<
  AuthBaseSchema & {
    '@type': 'StartOIDCResponse';
    authenticationUrl: string;
  }
>;
