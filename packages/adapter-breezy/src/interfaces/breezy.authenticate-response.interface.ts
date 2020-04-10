import { BreezyUser } from './breezy.user.interface';

export interface BreezyAuthenticateResponse {
  access_token: string;
  user: BreezyUser;
}
