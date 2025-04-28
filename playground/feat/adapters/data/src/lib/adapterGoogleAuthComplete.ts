import { GOOGLE_ADMIN_DIRECTORY_COMMAND_NAME } from '@easybread/adapter-google-admin-directory';

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
    GOOGLE_ADMIN_DIRECTORY_COMMAND_NAME.AUTH_OAUTH2_COMPLETE,
    {
      breadId: makeBreadId(userId),
      params: null,
      payload: {
        '@context': 'https://schema.easybread.io/auth',
        '@type': 'CompleteOAuth2Request',
        code,
        state,
      },
    },
  );

  if (!results.success) {
    new Error('Google Auth Failed', { cause: results.error });
  }

  await adapterCollection().updateOne(
    { slug, userId },
    {
      $set: { connectedAt: new Date() },
      $setOnInsert: { createdAt: new Date() },
    },
  );
}
