import type { AuthAttemptStateDataBase } from '@easybread/core';

export interface BambooOidcConnectionAttemptStateData
  extends AuthAttemptStateDataBase {
  breadId: string;
  companyName: string;
}
