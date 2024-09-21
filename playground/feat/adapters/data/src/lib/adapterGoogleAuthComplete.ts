import { clientGoogleAdminDirectory } from 'playground-easybread-clients';
import {
  type GoogleCommonOauth2CompleteOperation,
  GoogleCommonOperationName,
} from '@easybread/adapter-google-common';
import { adapterCollection } from 'playground-db';
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

  const adapter = await adapterCollection.findOne({
    slug,
    userId,
  });

  if (!adapter) {
    throw new Error('adapter not found');
  }

  if (adapter.connectionToken !== state) {
    throw new Error('state mismatch');
  }

  const results =
    await clientGoogleAdminDirectory.invoke<GoogleCommonOauth2CompleteOperation>(
      {
        name: GoogleCommonOperationName.AUTH_FLOW_COMPLETE,
        breadId: makeBreadId(userId),
        payload: { code },
      }
    );

  if (!results.rawPayload.success) {
    new Error('Google Auth Failed', { cause: results.rawPayload });
  }

  await adapterCollection.updateOne(
    {
      slug,
      userId,
    },
    {
      $set: {
        isConnected: true,
        connectionToken: undefined,
      },
    }
  );
}
