import { BreezyUser } from './breezy.user.interface';

export type BreezyAuthenticateResponse = {
  access_token: string;
  user: BreezyUser;
};
