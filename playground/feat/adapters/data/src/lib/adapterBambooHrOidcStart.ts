import { BAMBOO_HR_COMMAND_NAME } from '@easybread/adapter-bamboo-hr';

import { ADAPTER_NAME, makeBreadId } from 'playground-common';
import { type BambooHRAdapter, adapterCollection } from 'playground-db';
import { clientBambooHrGet } from 'playground-easybread-clients';

interface AdapterBambooHrOidcStartProps {
  companyName: string;
  userId: string;
}

export async function adapterBambooHrOidcStart(
  props: AdapterBambooHrOidcStartProps,
) {
  const { companyName, userId } = props;

  await adapterCollection().updateOne(
    {
      userId,
      slug: ADAPTER_NAME.BAMBOO_HR,
      connectionMethod: 'OIDC',
    } satisfies Partial<BambooHRAdapter>,
    {
      $set: {
        createdAt: new Date(),
        connectedAt: undefined,
        companyName,
      } satisfies Partial<BambooHRAdapter>,
    },
    { upsert: true },
  );

  const clientBambooHr = await clientBambooHrGet();

  const output = await clientBambooHr.invoke(
    BAMBOO_HR_COMMAND_NAME.AUTH_OIDC_START,
    {
      breadId: makeBreadId(userId),
      params: { '@type': 'Organization', name: companyName },
      payload: null,
    },
  );

  if (!output.success) {
    throw new Error('Bamboo HR Setup Basic Auth Failed', {
      cause: output.error,
    });
  }

  return output.payload;
}
