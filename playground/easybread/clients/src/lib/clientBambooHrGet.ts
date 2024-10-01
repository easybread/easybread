import {
  BambooHrAdapter,
  BambooHrAuthStrategy,
} from '@easybread/adapter-bamboo-hr';
import { stateAdapterMongoGet } from 'playground-easybread-state';
import { BreadAuthenticationLostEvent, EasyBreadClient } from '@easybread/core';
import { ADAPTER_NAME, parseBreadId } from 'playground-common';
import { adapterCollection } from 'playground-db';
import { revalidatePath } from 'next/cache';

let client: EasyBreadClient<BambooHrAdapter, BambooHrAuthStrategy>;

export async function clientBambooHrGet() {
  if (client) return client;

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
