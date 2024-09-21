'use server';

import { authorize } from 'playground-feat-auth-data';

export async function authorizeAction() {
  await authorize();
}
