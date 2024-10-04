'use server';

import { adapterCollection } from 'playground-db';
import { isAdapterName } from 'playground-common';
import { authorize } from 'playground-feat-auth-data';

export async function adapterStatusGet(slug: string) {
  if (!isAdapterName(slug)) throw new Error('invalid adapter name');
  const authStatus = await authorize();

  return adapterCollection().findOne({ slug, userId: authStatus.data.userId });
}
