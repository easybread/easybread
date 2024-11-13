import type { AuthTokenData } from './AuthTokenData';

export type Authorized = {
  authorized: true;
  data: AuthTokenData;
};
