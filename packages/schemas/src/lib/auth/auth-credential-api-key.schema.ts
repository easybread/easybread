import type { Simplify } from '@easybread/common';

import type { AuthBaseSchema } from './auth-base.schema';

export type AuthCredentialApiKeySchema = Simplify<
  AuthBaseSchema & {
    '@type': 'CredentialApiKey';
    key: string;
  }
>;
