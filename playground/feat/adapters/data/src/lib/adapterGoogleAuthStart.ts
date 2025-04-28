import { GOOGLE_ADMIN_DIRECTORY_COMMAND_NAME } from '@easybread/adapter-google-admin-directory';

import { ADAPTER_NAME, makeBreadId } from 'playground-common';
import { adapterCollection } from 'playground-db';
import { clientGoogleAdminDirectoryGet } from 'playground-easybread-clients';

export const adapterGoogleAuthStart = async (userId: string) => {
  const clientGoogleAdminDirectory = await clientGoogleAdminDirectoryGet();

  await adapterCollection().updateOne(
    { userId, slug: ADAPTER_NAME.GOOGLE_ADMIN_DIRECTORY },
    {
      $set: { createdAt: new Date(), connectedAt: undefined },
    },
    { upsert: true },
  );

  const result = await clientGoogleAdminDirectory.invoke(
    GOOGLE_ADMIN_DIRECTORY_COMMAND_NAME.AUTH_OAUTH2_START,
    {
      breadId: makeBreadId(userId),
      params: null,
      payload: {
        '@context': 'https://schema.easybread.io/auth',
        '@type': 'StartOAuth2Request',
        prompt: ['consent'],
        loginHint: 'hint',
        scope: [
          'https://www.googleapis.com/auth/admin.directory.user',
          'https://www.googleapis.com/auth/admin.directory.user.readonly',
          'https://www.googleapis.com/auth/cloud-platform',
        ],
      },
    },
  );

  if (!result.success) {
    throw new Error('adapterGoogleAuthStart failed', {
      cause: result.error,
    });
  }

  return result.payload;
};
