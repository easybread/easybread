import { EasyBreadClient } from '@easybread/core';
import {
  GsuiteAdminAdapter,
  GsuiteAdminAuthStrategy,
} from '@easybread/adapter-gsuite-admin';
import { inMemoryStateAdapter } from './in-memory-state-adapter';
import { load } from 'ts-dotenv';

const {
  GSUITE_ADMIN_CLIENT_ID,
  GSUITE_ADMIN_CLIENT_SECRET,
  GSUITE_ADMIN_REDIRECT_URI,
} = load({
  GSUITE_ADMIN_CLIENT_ID: String,
  GSUITE_ADMIN_CLIENT_SECRET: String,
  GSUITE_ADMIN_REDIRECT_URI: String,
});

const gsuiteServiceAdapter = new GsuiteAdminAdapter();
const gsuiteAdminAuthStrategy = new GsuiteAdminAuthStrategy(
  inMemoryStateAdapter,
  {
    clientId: GSUITE_ADMIN_CLIENT_ID,
    clientSecret: GSUITE_ADMIN_CLIENT_SECRET,
    redirectUri: GSUITE_ADMIN_REDIRECT_URI,
  }
);

export const gsuiteAdminClient = new EasyBreadClient(
  inMemoryStateAdapter,
  gsuiteServiceAdapter,
  gsuiteAdminAuthStrategy
);
