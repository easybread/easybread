import { BreadAuthenticationLostEvent, EasyBreadClient } from '@easybread/core';
import { stateAdapterMongo } from 'playground-easybread-state';
import {
  GoogleAdminDirectoryAdapter,
  GoogleAdminDirectoryAuthStrategy,
} from '@easybread/adapter-google-admin-directory';
import { load } from 'ts-dotenv';
import { ADAPTER_NAME, parseBreadId } from 'playground-common';
import { adapterCollection } from 'playground-db';

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI } = load({
  GOOGLE_CLIENT_ID: String,
  GOOGLE_CLIENT_SECRET: String,
  GOOGLE_REDIRECT_URI: String,
});

const googleAdminDirectoryAdapter = new GoogleAdminDirectoryAdapter();

const googleAuthStrategy = new GoogleAdminDirectoryAuthStrategy(
  stateAdapterMongo,
  {
    clientId: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    redirectUri: GOOGLE_REDIRECT_URI,
  }
);

export const clientGoogleAdminDirectory = new EasyBreadClient(
  stateAdapterMongo,
  googleAdminDirectoryAdapter,
  googleAuthStrategy
);

clientGoogleAdminDirectory.subscribe(
  BreadAuthenticationLostEvent.eventName,
  async (event) => {
    const { breadId } = event.payload;
    const { userId } = parseBreadId(breadId);

    console.log(event);

    await adapterCollection.deleteOne({
      userId,
      slug: ADAPTER_NAME.GOOGLE_ADMIN_DIRECTORY,
    });
  }
);
