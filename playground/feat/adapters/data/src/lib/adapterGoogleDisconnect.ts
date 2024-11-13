import { adapterCollection } from 'playground-db';
import { ADAPTER_NAME, makeBreadId } from 'playground-common';
import { clientGoogleAdminDirectoryGet } from 'playground-easybread-clients';

export async function adapterGoogleDisconnect(userId: string) {
  const clientGoogleAdminDirectory = await clientGoogleAdminDirectoryGet();

  await adapterCollection().deleteOne({
    slug: ADAPTER_NAME.GOOGLE_ADMIN_DIRECTORY,
    userId,
  });

  await clientGoogleAdminDirectory.unAuthenticate(makeBreadId(userId));
}
