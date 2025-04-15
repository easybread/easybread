import type { Simplify } from '@easybread/common';

import type { AuthBaseSchema } from './auth-base.schema';

export type AuthCredentialOidcSchema<TScope extends string = string> = Simplify<
  AuthBaseSchema & {
    '@type': 'CredentialOIDC';
    accessToken: string;
    refreshToken: string;
    tokenType: 'Bearer';
    scope: TScope[];
    expiresIn: number;
  }
>;
