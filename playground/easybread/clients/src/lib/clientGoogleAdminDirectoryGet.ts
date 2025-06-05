import { load } from 'ts-dotenv';

import {
  GoogleAdminDirectoryAdapter,
  GoogleAdminDirectoryAuthStrategy,
} from '@easybread/adapter-google-admin-directory';
import { AuthenticationLostEvent, EasyBreadClient } from '@easybread/core';

import { ADAPTER_NAME, parseBreadId } from 'playground-common';
import { adapterCollection } from 'playground-db';
import { stateAdapterMongoGet } from 'playground-easybread-state';

let client: EasyBreadClient<GoogleAdminDirectoryAdapter>;

export const clientGoogleAdminDirectoryGet = async () => {
  if (client) return client;

  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI } = load({
    GOOGLE_CLIENT_ID: String,
    GOOGLE_CLIENT_SECRET: String,
    GOOGLE_REDIRECT_URI: String,
  });

  const stateAdapter = await stateAdapterMongoGet();
  const authStrategy = new GoogleAdminDirectoryAuthStrategy(stateAdapter, {
    clientId: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    redirectUri: GOOGLE_REDIRECT_URI,
  });

  const serviceAdapter = new GoogleAdminDirectoryAdapter(authStrategy);

  client = new EasyBreadClient(stateAdapter, serviceAdapter);

  client.subscribe(AuthenticationLostEvent.eventName, async event => {
    const { breadId } = event.payload;
    const { userId } = parseBreadId(breadId);

    await adapterCollection().deleteOne({
      userId,
      slug: ADAPTER_NAME.GOOGLE_ADMIN_DIRECTORY,
    });
  });

  return client;
};
