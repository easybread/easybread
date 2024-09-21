import { adapterCollection } from 'playground-db';
import { authStatusGet } from 'playground-feat-auth-data';

export async function adapterListGet() {
  const authData = authStatusGet();

  if (!authData.authorized) return [];

  return await adapterCollection
    .find({
      userId: authData.data.userId,
      isConnected: true,
    })
    .toArray();
}
