import { GoogleCommonOperationName } from '@easybread/adapter-google-common';
import { isAdapterName, makeBreadId } from 'playground-common';
import {
  adapterCollection,
  isGoogleAdminDirectoryAdapter,
} from 'playground-db';
import { clientGoogleAdminDirectoryGet } from 'playground-easybread-clients';

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

  const results = await clientGoogleAdminDirectory.invoke(
    GoogleCommonOperationName.AUTH_FLOW_COMPLETE,
    {
      breadId: makeBreadId(userId),
      payload: { code, state },
    },
  );

  if (!results.rawPayload.success) {
    new Error('Google Auth Failed', { cause: results.rawPayload });
  }

  await adapterCollection().updateOne(
    { slug, userId },
    {
      $set: { connectedAt: new Date() },
      $setOnInsert: { createdAt: new Date() },
    },
  );
}
