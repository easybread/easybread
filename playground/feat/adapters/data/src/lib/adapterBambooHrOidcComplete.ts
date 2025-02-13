import { BambooHrOperationName } from '@easybread/adapter-bamboo-hr';
import { redirect } from 'next/navigation';
import { ADAPTER_NAME, makeBreadId } from 'playground-common';
import {
  type BambooHRAdapter,
  adapterCollection,
  isBambooHrAdapter,
} from 'playground-db';
import { clientBambooHrGet } from 'playground-easybread-clients';

export interface AdapterBambooHrOidcCompleteOptions {
  userId: string;
  code: string;
  state: string;
}

export async function adapterBambooHrOidcComplete(
  options: AdapterBambooHrOidcCompleteOptions,
) {
  const { userId, code, state } = options;

  const adapter = await adapterCollection().findOne({
    slug: ADAPTER_NAME.BAMBOO_HR,
    userId,
  });

  if (!adapter || !isBambooHrAdapter(adapter)) {
    throw new Error('BAMBOO_HR_ADAPTER_NOT_FOUND');
  }

  const clientBambooHr = await clientBambooHrGet();

  const results = await clientBambooHr.invoke(
    BambooHrOperationName.OIDC_AUTH_COMPLETE,
    {
      breadId: makeBreadId(userId),
      payload: { code, state },
    },
  );

  if (results.rawPayload.success === false) {
    throw new Error('BAMBOO_HR_OIDC_COMPLETE_FAILED');
  }

  await adapterCollection().updateOne(
    {
      slug: ADAPTER_NAME.BAMBOO_HR,
      userId,
      connectionMethod: 'OIDC',
    } satisfies Partial<BambooHRAdapter>,

    {
      $set: {
        connectedAt: new Date(),
        companyName: results.rawPayload.data.companyName,
      } satisfies Partial<BambooHRAdapter>,

      $setOnInsert: {
        createdAt: new Date(),
      } satisfies Partial<BambooHRAdapter>,
    },

    { upsert: true },
  );

  redirect('/adapters');
}
