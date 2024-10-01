import { adapterCollection } from 'playground-db';
import { ADAPTER_NAME, makeBreadId } from 'playground-common';
import { clientGoogleAdminDirectoryGet } from 'playground-easybread-clients';
import { authorize } from 'playground-feat-auth-data';

export async function adapterGoogleDisconnect() {
  const authStatus = await authorize();
  const clientGoogleAdminDirectory = await clientGoogleAdminDirectoryGet();

  await adapterCollection().deleteOne({
    slug: ADAPTER_NAME.GOOGLE_ADMIN_DIRECTORY,
    userId: authStatus.data.userId,
  });

  await clientGoogleAdminDirectory.unAuthenticate(
    makeBreadId(authStatus.data.userId)
  );
}
