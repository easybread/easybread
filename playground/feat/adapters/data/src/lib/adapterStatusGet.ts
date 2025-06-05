import { redirect } from 'next/navigation';

import { isAdapterName } from 'playground-common';
import { adapterCollection } from 'playground-db';
import { authStatusGet } from 'playground-feat-auth-data';

export async function adapterStatusGet(slug: string) {
  if (!isAdapterName(slug)) throw new Error('invalid adapter name');

  const authStatus = await authStatusGet();

  if (!authStatus.authorized) return redirect(`/login`);

  return adapterCollection().findOne({ slug, userId: authStatus.data.userId });
}
