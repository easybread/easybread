import { revalidatePath } from 'next/cache';
import { load } from 'ts-dotenv';

import {
  BambooHrAdapter,
  BambooHrAuthStrategy,
} from '@easybread/adapter-bamboo-hr';
import { AuthenticationLostEvent, EasyBreadClient } from '@easybread/core';

import { ADAPTER_NAME, parseBreadId } from 'playground-common';
import { adapterCollection } from 'playground-db';
import { stateAdapterMongoGet } from 'playground-easybread-state';

let client: EasyBreadClient<BambooHrAdapter>;

export async function clientBambooHrGet() {
  if (client) return client;

  const {
    BAMBOO_HR_OID_CLIENT_ID,
    BAMBOO_HR_OID_CLIENT_SECRET,
    BAMBOO_HR_OID_REDIRECT_URI,
    BAMBOO_HR_OID_APPLICATION_API_KEY,
  } = load({
    BAMBOO_HR_OID_CLIENT_ID: String,
    BAMBOO_HR_OID_CLIENT_SECRET: String,
    BAMBOO_HR_OID_REDIRECT_URI: String,
    BAMBOO_HR_OID_APPLICATION_API_KEY: String,
  });

  const stateAdapter = await stateAdapterMongoGet();
  const authStrategy = new BambooHrAuthStrategy(stateAdapter, {
    oidcOptions: {
      clientId: BAMBOO_HR_OID_CLIENT_ID,
      clientSecret: BAMBOO_HR_OID_CLIENT_SECRET,
      redirectUri: BAMBOO_HR_OID_REDIRECT_URI,
      applicationKey: BAMBOO_HR_OID_APPLICATION_API_KEY,
    },
  });
  const adapter = new BambooHrAdapter(authStrategy);

  client = new EasyBreadClient(stateAdapter, adapter);

  client.subscribe(AuthenticationLostEvent.eventName, async event => {
    const { breadId } = event.payload;
    const { userId } = parseBreadId(breadId);

    await adapterCollection().deleteOne({
      userId,
      slug: ADAPTER_NAME.BAMBOO_HR,
    });

    revalidatePath(`/`);
  });

  return client;
}
