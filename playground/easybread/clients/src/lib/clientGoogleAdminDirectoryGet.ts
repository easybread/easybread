import { BreadAuthenticationLostEvent, EasyBreadClient } from '@easybread/core';
import { stateAdapterMongoGet } from 'playground-easybread-state';
import {
  GoogleAdminDirectoryAdapter,
  GoogleAdminDirectoryAuthStrategy,
} from '@easybread/adapter-google-admin-directory';
import { load } from 'ts-dotenv';
import { ADAPTER_NAME, parseBreadId } from 'playground-common';
import { adapterCollection } from 'playground-db';
import { revalidatePath } from 'next/cache';

let client: EasyBreadClient<
  GoogleAdminDirectoryAdapter,
  GoogleAdminDirectoryAuthStrategy
>;

export const clientGoogleAdminDirectoryGet = async () => {
  if (client) return client;

  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI } = load({
    GOOGLE_CLIENT_ID: String,
    GOOGLE_CLIENT_SECRET: String,
    GOOGLE_REDIRECT_URI: String,
  });

  const googleAdminDirectoryAdapter = new GoogleAdminDirectoryAdapter();

  const stateAdapter = await stateAdapterMongoGet();

  const googleAuthStrategy = new GoogleAdminDirectoryAuthStrategy(
    stateAdapter,
    {
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      redirectUri: GOOGLE_REDIRECT_URI,
    }
  );

  client = new EasyBreadClient(
    stateAdapter,
    googleAdminDirectoryAdapter,
    googleAuthStrategy
  );

  client.subscribe(BreadAuthenticationLostEvent.eventName, async (event) => {
    const { breadId } = event.payload;
    const { userId } = parseBreadId(breadId);

    await adapterCollection().deleteOne({
      userId,
      slug: ADAPTER_NAME.GOOGLE_ADMIN_DIRECTORY,
    });

    revalidatePath(`/`);
  });

  return client;
};
