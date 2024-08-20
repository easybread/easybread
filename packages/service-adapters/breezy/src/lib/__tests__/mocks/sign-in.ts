import { BreezyAuthenticateResponse } from '../../interfaces';
import { EMAIL } from './credentials';

export const SIGN_IN_RESPONSE_MOCK: BreezyAuthenticateResponse = {
  access_token: 'accessToken',
  user: {
    _id: '123',
    creation_date: new Date().toISOString(),
    email_address: EMAIL,
    initial: 'T',
    name: 'Test',
    updated_date: new Date().toISOString(),
    username: 'Test',
    verified_email: true,
  },
};
