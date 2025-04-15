import type { Simplify } from '@easybread/common';

import type { AuthBaseSchema } from './auth-base.schema';

export type AuthStartOidcRequestSchema<TScope extends string = string> =
  Simplify<
    AuthBaseSchema & {
      '@type': 'StartOIDCRequest';
      scope: TScope[];
    }
  >;
