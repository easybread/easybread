'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { ADAPTER_NAME, isAdapterName } from 'playground-common';
import {
  adapterBambooHrDisconnect,
  adapterGoogleDisconnect,
} from 'playground-feat-adapters-data';
import { authStatusGet } from 'playground-feat-auth-data';

export async function adapterDisconnectAction(name: string) {
  if (!isAdapterName(name)) return;

  const authStatus = await authStatusGet();

  if (!authStatus.authorized) redirect(`/login`);

  switch (name) {
    case ADAPTER_NAME.GOOGLE_ADMIN_DIRECTORY:
      await adapterGoogleDisconnect(authStatus.data.userId);
      break;

    case ADAPTER_NAME.BAMBOO_HR:
      console.log('Bamboo HR Disconnect');
      await adapterBambooHrDisconnect(authStatus.data.userId);
      break;
    default:
      throw new Error(`Adapter not found: ${name}`);
  }

  revalidatePath('/');
}
