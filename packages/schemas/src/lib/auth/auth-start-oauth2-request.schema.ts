import type { Simplify } from '@easybread/common';

import type { AuthBaseSchema } from './auth-base.schema';

export type AuthStartOauth2RequestSchema<TScope extends string = string> =
  Simplify<
    AuthBaseSchema & {
      '@type': 'StartOAuth2Request';
      scope: TScope[];
      loginHint?: string;
      prompt?: 'none' | ('consent' | 'select_account')[];
      /* from google common:
       *  includeGrantedScopes?: boolean;
       *  loginHint?: string;
       *  prompt?: 'none' | ('consent' | 'select_account')[];
       *  */
    }
  >;
