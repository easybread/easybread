import { BreadOauth2StateData } from '@easybread/core';

export interface GoogleOauth2StateData extends BreadOauth2StateData {
  clientId: string;
  clientSecret: string;
}
