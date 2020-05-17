import {
  GoogleContactsAdapter,
  GoogleContactsAuthStrategy
} from '@easybread/adapter-google-contacts';
import { EasyBreadClient } from '@easybread/core';

import { stateAdapter } from '../state';

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_CONTACTS_REDIRECT_URI
} = process.env;

if (!GOOGLE_CLIENT_ID) {
  throw new Error('GOOGLE_CLIENT_ID env variable is not defined');
}
if (!GOOGLE_CLIENT_SECRET) {
  throw new Error('GOOGLE_CLIENT_SECRET env variable is not defined');
}
if (!GOOGLE_CONTACTS_REDIRECT_URI) {
  throw new Error('GOOGLE_CONTACTS_REDIRECT_URI env variable is not defined');
}

const googleAdapter = new GoogleContactsAdapter();
const googleAuthStrategy = new GoogleContactsAuthStrategy(stateAdapter, {
  clientId: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  redirectUri: GOOGLE_CONTACTS_REDIRECT_URI
});

export const googleContactsClient = new EasyBreadClient(
  stateAdapter,
  googleAdapter,
  googleAuthStrategy
);
