import { authorize } from 'playground-feat-auth-data';
import { clientBambooHrGet } from 'playground-easybread-clients';
import { adapterCollection } from 'playground-db';
import { ADAPTER_NAME, makeBreadId } from 'playground-common';

export async function adapterBambooHrDisconnect() {
  const authStatus = await authorize();
  const clientBambooHr = await clientBambooHrGet();

  console.log('disconnecting bamboo-hr', authStatus.data.userId);
  await adapterCollection().deleteOne({
    slug: ADAPTER_NAME.BAMBOO_HR,
    userId: authStatus.data.userId,
  });

  await clientBambooHr.unAuthenticate(makeBreadId(authStatus.data.userId));
}
