import { authorize } from 'playground-feat-auth-data';
import { clientBambooHrGet } from 'playground-easybread-clients';
import { BreadOperationName } from '@easybread/operations';
import { ADAPTER_NAME, makeBreadId } from 'playground-common';
import { adapterCollection } from 'playground-db';

export type AdapterBambooHrConnectParams = {
  apiKey: string;
  companyName: string;
};

export async function adapterBambooHrConnect({
  apiKey,
  companyName,
}: AdapterBambooHrConnectParams) {
  const authData = await authorize();

  const clientBambooHr = await clientBambooHrGet();

  const output = await clientBambooHr.invoke({
    name: BreadOperationName.SETUP_BASIC_AUTH,
    breadId: makeBreadId(authData.data.userId),
    payload: { apiKey, companyName },
  });

  if (!output.rawPayload.success) {
    console.log(output);
    throw new Error('Bamboo HR Setup Basic Auth Failed');
  }

  await adapterCollection().insertOne({
    slug: ADAPTER_NAME.BAMBOO_HR,
    userId: authData.data.userId,
    createdAt: new Date(),
    isConnected: true,
  });
}
