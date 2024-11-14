import { clientGoogleAdminDirectoryGet } from 'playground-easybread-clients';
import { GoogleCommonOperationName } from '@easybread/adapter-google-common';
import {
  adapterCollection,
  isGoogleAdminDirectoryAdapter,
} from 'playground-db';
import { isAdapterName, makeBreadId } from 'playground-common';

interface AdapterGoogleAuthCompleteParams {
  userId: string;
  code: string;
  slug: string;
  state: string;
}

export async function adapterGoogleAuthComplete({
  userId,
  code,
  slug,
  state,
}: AdapterGoogleAuthCompleteParams) {
  if (!isAdapterName(slug)) throw new Error('invalid adapter name');
  const clientGoogleAdminDirectory = await clientGoogleAdminDirectoryGet();

  const adapter = await adapterCollection().findOne({
    slug,
    userId,
  });

  if (!adapter || !isGoogleAdminDirectoryAdapter(adapter)) {
    throw new Error('GOOGLE_ADMIN_DIRECTORY_ADAPTER_NOT_FOUND');
  }

  if (adapter.connectionToken !== state) {
    throw new Error('STATE_MISMATCH');
  }

  if (adapter.userId !== userId) {
    throw new Error('USER_ID_MISMATCH');
  }

  const results = await clientGoogleAdminDirectory.invoke(
    GoogleCommonOperationName.AUTH_FLOW_COMPLETE,
    {
      breadId: makeBreadId(userId),
      payload: { code },
    }
  );

  if (!results.rawPayload.success) {
    new Error('Google Auth Failed', { cause: results.rawPayload });
  }

  await adapterCollection().updateOne(
    {
      slug,
      userId,
    },
    {
      $set: {
        connectedAt: new Date(),
        connectionToken: undefined,
      },
    }
  );
}
