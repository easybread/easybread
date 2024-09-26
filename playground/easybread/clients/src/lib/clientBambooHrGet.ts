import { load } from 'ts-dotenv';
import {
  BambooHrAdapter,
  BambooHrAuthStrategy,
  type BambooHrOperation,
} from '@easybread/adapter-bamboo-hr';
import { stateAdapterMongoGet } from 'playground-easybread-state';
import { BreadAuthenticationLostEvent, EasyBreadClient } from '@easybread/core';
import { ADAPTER_NAME, parseBreadId } from 'playground-common';
import { adapterCollection } from 'playground-db';
import { revalidatePath } from 'next/cache';

let client: EasyBreadClient<BambooHrOperation, BambooHrAuthStrategy, null>;

export async function clientBambooHrGet() {
  if (client) return client;

  const { BAMBOO_HR_KEY } = load({ BAMBOO_HR_KEY: String });

  const adapter = new BambooHrAdapter();
  const stateAdapter = await stateAdapterMongoGet();
  const authStrategy = new BambooHrAuthStrategy(stateAdapter);

  client = new EasyBreadClient(stateAdapter, adapter, authStrategy);

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
}
