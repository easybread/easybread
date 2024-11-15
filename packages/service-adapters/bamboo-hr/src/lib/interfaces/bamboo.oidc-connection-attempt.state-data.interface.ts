import type { BreadAuthAttemptStateDataBase } from '@easybread/core';

export interface BambooOidcConnectionAttemptStateData
  extends BreadAuthAttemptStateDataBase {
  breadId: string;
  companyName: string;
}
