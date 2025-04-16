import { BreezyAdapter, BreezyAuthStrategy } from '@easybread/adapter-breezy';
import { AuthenticationLostEvent, EasyBreadClient } from '@easybread/core';
import { ADAPTER_NAME, parseBreadId } from 'playground-common';
import { adapterCollection } from 'playground-db';
import { stateAdapterMongoGet } from 'playground-easybread-state';

let client: EasyBreadClient<BreezyAdapter>;

export async function clientBreezyGet() {
  if (client) return client;

  const stateAdapter = await stateAdapterMongoGet();
  const authStrategy = new BreezyAuthStrategy(stateAdapter);
  const breezyAdapter = new BreezyAdapter(authStrategy);

  client = new EasyBreadClient(stateAdapter, breezyAdapter);

  client.subscribe(AuthenticationLostEvent.eventName, async event => {
    const { breadId } = event.payload;
    const { userId } = parseBreadId(breadId);

    console.log(
      `authentication lost at ${client.providerName} for user ${userId}`,
    );

    await adapterCollection().deleteOne({
      userId,
      slug: ADAPTER_NAME.BREEZY,
    });
  });

  return client;
}
