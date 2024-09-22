import { adapterCollection } from 'playground-db';
import { ADAPTER_NAME, makeBreadId } from 'playground-common';
import { clientGoogleAdminDirectoryGet } from 'playground-easybread-clients';
import { authStatusGet } from 'playground-feat-auth-data';

export async function adapterGoogleDisconnect() {
  const authStatus = authStatusGet();
  const clientGoogleAdminDirectory = await clientGoogleAdminDirectoryGet();

  if (!authStatus.authorized) return;

  await adapterCollection().deleteOne({
    slug: ADAPTER_NAME.GOOGLE_ADMIN_DIRECTORY,
  });

  await clientGoogleAdminDirectory.unAuthenticate(
    makeBreadId(authStatus.data.userId)
  );
}
