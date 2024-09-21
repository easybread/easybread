'use server';

import { ADAPTER_NAME, isAdapterName } from 'playground-common';
import { adapterGoogleAuthStart } from 'playground-feat-adapters-data';

export async function adapterConnectAction(name: string) {
  if (!isAdapterName(name)) return;

  switch (name) {
    case ADAPTER_NAME.GOOGLE_ADMIN_DIRECTORY:
      return adapterGoogleAuthStart();
    default:
      throw new Error(`Adapter not found: ${name}`);
  }
}
