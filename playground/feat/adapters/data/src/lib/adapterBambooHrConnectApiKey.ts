import { BAMBOO_HR_COMMAND_NAME } from '@easybread/adapter-bamboo-hr';

import { ADAPTER_NAME, makeBreadId } from 'playground-common';
import { type BambooHRAdapter, adapterCollection } from 'playground-db';
import { clientBambooHrGet } from 'playground-easybread-clients';

export type AdapterBambooHrConnectParams = {
  apiKey: string;
  companyName: string;
  userId: string;
};

export async function adapterBambooHrConnectApiKey({
  apiKey,
  companyName,
  userId,
}: AdapterBambooHrConnectParams) {
  const clientBambooHr = await clientBambooHrGet();

  const output = await clientBambooHr.invoke(
    BAMBOO_HR_COMMAND_NAME.AUTH_BASIC_SET,
    {
      breadId: makeBreadId(userId),
      params: null,
      payload: {
        '@context': 'https://schema.easybread.io/auth',
        '@type': 'CredentialBasic',
        username: companyName,
        password: apiKey,
      },
    },
  );

  if (!output.success) {
    throw new Error('Bamboo HR Setup Basic Auth Failed', {
      cause: output.error,
    });
  }

  await adapterCollection().updateOne(
    { slug: ADAPTER_NAME.BAMBOO_HR, userId, connectionMethod: 'API_KEY' },
    {
      $set: {
        createdAt: new Date(),
        connectedAt: new Date(),
        companyName,
      } satisfies Partial<BambooHRAdapter>,
    },
    { upsert: true },
  );
}
