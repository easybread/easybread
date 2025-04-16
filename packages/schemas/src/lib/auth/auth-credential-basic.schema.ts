import type { Simplify } from '@easybread/common';

import type { AuthBaseSchema } from './auth-base.schema';

export type AuthCredentialBasicSchema = Simplify<
  AuthBaseSchema & {
    '@type': 'CredentialBasic';
    username: string;
    password: string;
  }
>;
