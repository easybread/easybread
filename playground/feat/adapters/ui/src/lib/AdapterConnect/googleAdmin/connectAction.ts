'use server';

import { adapterGoogleAuthStart } from 'playground-feat-adapters-data';

export async function connectAction() {
  await adapterGoogleAuthStart();
}
