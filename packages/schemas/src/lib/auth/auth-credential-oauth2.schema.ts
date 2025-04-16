import type { Simplify } from '@easybread/common';

import type { AuthBaseSchema } from './auth-base.schema';

export type AuthCredentialOauth2Schema<TScope extends string = string> =
  Simplify<
    AuthBaseSchema & {
      '@type': 'CredentialOAuth2';
      accessToken: string;
      refreshToken: string;
      tokenType: 'Bearer';
      scope: TScope[];
      expiresIn: number;
    }
  >;
