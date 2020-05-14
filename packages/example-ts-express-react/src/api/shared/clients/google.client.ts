import {
  GoogleAdapter,
  GoogleAuthStrategy
} from '@easybread/adapter-google-contacts';
import { EasyBreadClient } from '@easybread/core';

import { stateAdapter } from '../state';

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI
} = process.env;

if (!GOOGLE_CLIENT_ID) {
  throw new Error('GOOGLE_CLIENT_ID env variable is not defined');
}
if (!GOOGLE_CLIENT_SECRET) {
  throw new Error('GOOGLE_CLIENT_SECRET env variable is not defined');
}
if (!GOOGLE_REDIRECT_URI) {
  throw new Error('GOOGLE_REDIRECT_URI env variable is not defined');
}

const googleAdapter = new GoogleAdapter();
const googleAuthStrategy = new GoogleAuthStrategy(stateAdapter, {
  clientId: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  redirectUri: GOOGLE_REDIRECT_URI
});

export const googleClient = new EasyBreadClient(
  stateAdapter,
  googleAdapter,
  googleAuthStrategy
);
