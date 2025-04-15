'use server';

import { redirect } from 'next/navigation';
import { adapterGoogleAuthStart } from 'playground-feat-adapters-data';
import { authStatusGet } from 'playground-feat-auth-data';

export async function adapterGoogleAdminDirectoryConnectAction() {
  const authStatus = await authStatusGet();

  if (!authStatus.authorized) return redirect(`/login`);

  const { authenticationUrl } = await adapterGoogleAuthStart(
    authStatus.data.userId,
  );

  redirect(authenticationUrl);
}
