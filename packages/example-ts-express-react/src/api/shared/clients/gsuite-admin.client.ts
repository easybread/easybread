import {
  GsuiteAdminAdapter,
  GsuiteAdminAuthStrategy
} from '@easybread/adapter-gsuite-admin';
import { EasyBreadClient } from '@easybread/core';

import { stateAdapter } from '../state';

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GSUITE_ADMIN_REDIRECT_URI
} = process.env;

if (!GOOGLE_CLIENT_ID) {
  throw new Error('GOOGLE_CLIENT_ID env variable is not defined');
}
if (!GOOGLE_CLIENT_SECRET) {
  throw new Error('GOOGLE_CLIENT_SECRET env variable is not defined');
}
if (!GSUITE_ADMIN_REDIRECT_URI) {
  throw new Error('GSUITE_ADMIN_REDIRECT_URI env variable is not defined');
}

const gsuiteAdminAdapter = new GsuiteAdminAdapter();
const gsuiteAdminAuthStrategy = new GsuiteAdminAuthStrategy(stateAdapter, {
  clientId: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  redirectUri: GSUITE_ADMIN_REDIRECT_URI
});

export const gsuiteAdminClient = new EasyBreadClient(
  stateAdapter,
  gsuiteAdminAdapter,
  gsuiteAdminAuthStrategy
);
