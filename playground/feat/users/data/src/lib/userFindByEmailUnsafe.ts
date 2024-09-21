import { userCollection } from 'playground-db';

export async function userFindByEmailUnsafe(email: string) {
  return userCollection.findOne({ email });
}
