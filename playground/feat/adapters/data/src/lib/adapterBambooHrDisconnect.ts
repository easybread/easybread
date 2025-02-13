import { ADAPTER_NAME, makeBreadId } from 'playground-common';
import { adapterCollection } from 'playground-db';
import { clientBambooHrGet } from 'playground-easybread-clients';

export async function adapterBambooHrDisconnect(userId: string) {
  const clientBambooHr = await clientBambooHrGet();

  console.log('disconnecting bamboo-hr', userId);
  await adapterCollection().deleteOne({
    slug: ADAPTER_NAME.BAMBOO_HR,
    userId,
  });

  await clientBambooHr.unAuthenticate(makeBreadId(userId));
}
