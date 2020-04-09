import { BreadOauth2StateData } from '../../../auth-strategy/interfaces';

export interface GoogleOauth2StateData extends BreadOauth2StateData {
  clientId: string;
  clientSecret: string;
}
