import { BreezyAuthenticateResponse } from '../../interfaces';

import { EMAIL } from './credentials';

export const SIGN_IN_RESPONSE_MOCK: BreezyAuthenticateResponse = {
  access_token: 'accessToken',
  user: {
    _id: '123',
    creation_date: new Date('2025-03-30T01:00:00.000Z').toISOString(),
    email_address: EMAIL,
    initial: 'T',
    name: 'Test',
    updated_date: new Date('2025-04-02T01:00:00.000Z').toISOString(),
    username: 'Test',
    verified_email: true,
  },
};
