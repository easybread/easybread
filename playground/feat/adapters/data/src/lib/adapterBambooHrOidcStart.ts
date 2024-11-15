import { BambooHrOperationName } from '@easybread/adapter-bamboo-hr';
import { clientBambooHrGet } from 'playground-easybread-clients';
import { ADAPTER_NAME, makeBreadId } from 'playground-common';
import { adapterCollection, type BambooHRAdapter } from 'playground-db';

interface AdapterBambooHrOidcStartProps {
  companyName: string;
  userId: string;
}

export async function adapterBambooHrOidcStart(
  props: AdapterBambooHrOidcStartProps
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
    { upsert: true }
  );

  const clientBambooHr = await clientBambooHrGet();

  const output = await clientBambooHr.invoke(
    BambooHrOperationName.OIDC_AUTH_START,
    {
      breadId: makeBreadId(userId),
      payload: { companyName },
    }
  );

  if (!output.rawPayload.success) {
    throw new Error('Bamboo HR Setup Basic Auth Failed', {
      cause: output.rawPayload.error,
    });
  }

  return output.rawPayload.data;
}
