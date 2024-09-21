'use server';

import { adapterCollection } from 'playground-db';
import { isAdapterName } from 'playground-common';

export async function adapterStatusGet(slug: string) {
  if (!isAdapterName(slug)) throw new Error('invalid adapter name');
  return adapterCollection.findOne({ slug });
}
