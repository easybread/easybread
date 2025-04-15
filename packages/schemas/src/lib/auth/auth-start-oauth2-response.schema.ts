import type { Simplify } from '@easybread/common';

import type { AuthBaseSchema } from './auth-base.schema';

export type AuthStartOauth2ResponseSchema = Simplify<
  AuthBaseSchema & {
    '@type': 'StartOAuth2Response';
    authenticationUrl: string;
  }
>;
