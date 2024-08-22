import { BreezyAuthenticateResponse } from '../../interfaces';
import { EMAIL } from './credentials';

export const SIGN_IN_RESPONSE_MOCK: BreezyAuthenticateResponse = {
  // eslint-disable-next-line @typescript-eslint/camelcase
  access_token: 'accessToken',
  user: {
    _id: '123',
    // eslint-disable-next-line @typescript-eslint/camelcase
    creation_date: new Date().toISOString(),
    // eslint-disable-next-line @typescript-eslint/camelcase
    email_address: EMAIL,
    initial: 'T',
    name: 'Test',
    // eslint-disable-next-line @typescript-eslint/camelcase
    updated_date: new Date().toISOString(),
    username: 'Test',
    // eslint-disable-next-line @typescript-eslint/camelcase
    verified_email: true
  }
};
