import type { Simplify } from '@easybread/common';

import type { AuthBaseSchema } from './auth-base.schema';
import type { AuthCredentialOauth2Schema } from './auth-credential-oauth2.schema';

export type AuthCompleteOauth2ResponseSchema = Simplify<
  AuthBaseSchema & {
    '@type': 'CompleteOAuth2Response';
    credential: AuthCredentialOauth2Schema;
  }
>;
