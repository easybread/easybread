import type { Simplify } from '@easybread/common';

import type { AuthBaseSchema } from './auth-base.schema';

export type AuthCompleteOauth2RequestSchema = Simplify<
  AuthBaseSchema & {
    '@type': 'CompleteOAuth2Request';
    code: string;
    state?: string;
  }
>;
