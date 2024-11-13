'use server';

import { adapterGoogleAuthStart } from 'playground-feat-adapters-data';
import { authStatusGet } from 'playground-feat-auth-data';
import { redirect } from 'next/navigation';

export async function adapterGoogleAdminDirectoryConnectAction() {
  const authStatus = await authStatusGet();

  if (!authStatus.authorized) return redirect(`/login`);

  await adapterGoogleAuthStart(authStatus.data.userId);
}
