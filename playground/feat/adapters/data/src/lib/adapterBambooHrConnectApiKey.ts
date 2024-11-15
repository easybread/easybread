import { clientBambooHrGet } from 'playground-easybread-clients';
import { BreadOperationName } from '@easybread/operations';
import { ADAPTER_NAME, makeBreadId } from 'playground-common';
import { adapterCollection, type BambooHRAdapter } from 'playground-db';

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
    BreadOperationName.SETUP_BASIC_AUTH,
    {
      breadId: makeBreadId(userId),
      payload: { apiKey, companyName },
    }
  );

  if (!output.rawPayload.success) {
    throw new Error('Bamboo HR Setup Basic Auth Failed');
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
    { upsert: true }
  );
}
