'use server';

import { ADAPTER_NAME, isAdapterName } from 'playground-common';
import {
  adapterBambooHrDisconnect,
  adapterGoogleDisconnect,
} from 'playground-feat-adapters-data';
import { revalidatePath } from 'next/cache';

export async function adapterDisconnectAction(name: string) {
  console.log('AdapterDisconnectAction', name);
  if (!isAdapterName(name)) return;
  switch (name) {
    case ADAPTER_NAME.GOOGLE_ADMIN_DIRECTORY:
      await adapterGoogleDisconnect();
      break;

    case ADAPTER_NAME.BAMBOO_HR:
      console.log('Bamboo HR Disconnect');
      await adapterBambooHrDisconnect();
      break;
    default:
      throw new Error(`Adapter not found: ${name}`);
  }

  revalidatePath('/');
}
