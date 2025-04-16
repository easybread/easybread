import { ADAPTER_NAME, makeBreadId } from 'playground-common';
import { adapterCollection } from 'playground-db';
import { clientBreezyGet } from 'playground-easybread-clients';

export async function adapterBreezyDisconnect(userId: string) {
  const clientBreezy = await clientBreezyGet();

  console.log('disconnecting breezy', userId);

  await clientBreezy.unAuthenticate(makeBreadId(userId));
  await adapterCollection().deleteOne({
    slug: ADAPTER_NAME.BREEZY,
    userId,
  });
}
