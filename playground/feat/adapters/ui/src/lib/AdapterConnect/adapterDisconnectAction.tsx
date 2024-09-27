'use server';

import { ADAPTER_NAME, isAdapterName } from 'playground-common';
import { adapterGoogleDisconnect } from 'playground-feat-adapters-data';
import { revalidatePath } from 'next/cache';

export async function adapterDisconnectAction(name: string) {
  if (!isAdapterName(name)) return;
  switch (name) {
    case ADAPTER_NAME.GOOGLE_ADMIN_DIRECTORY:
      await adapterGoogleDisconnect();
      break;
    default:
      throw new Error(`Adapter not found: ${name}`);
  }

  revalidatePath('/');
}
