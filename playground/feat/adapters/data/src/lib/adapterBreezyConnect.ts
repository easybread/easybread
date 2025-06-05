import { BREEZY_COMMAND_NAME } from '@easybread/adapter-breezy';

import { ADAPTER_NAME, makeBreadId } from 'playground-common';
import { type BreezyAdapter, adapterCollection } from 'playground-db';
import { clientBreezyGet } from 'playground-easybread-clients';

export async function adapterBreezyConnect(params: {
  ownerUserId: string;
  email: string;
  password: string;
}) {
  const clientBreezy = await clientBreezyGet();
  const output = await clientBreezy.invoke(BREEZY_COMMAND_NAME.AUTH_BASIC_SET, {
    breadId: makeBreadId(params.ownerUserId),
    params: null,
    payload: {
      '@context': 'https://schema.easybread.io/auth',
      '@type': 'CredentialBasic',
      username: params.email,
      password: params.password,
    },
  });

  if (!output.success) {
    throw new Error('Breezy Setup Basic Auth Failed', {
      cause: output.error,
    });
  }

  await adapterCollection().updateOne(
    { slug: ADAPTER_NAME.BREEZY, userId: params.ownerUserId },
    {
      $set: {
        createdAt: new Date(),
        connectedAt: new Date(),
        email: params.email,
      } satisfies Partial<BreezyAdapter>,
    },
    { upsert: true },
  );
}
