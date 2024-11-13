import { clientGoogleAdminDirectoryGet } from 'playground-easybread-clients';
import {
  type GoogleCommonOauth2StartOperation,
  GoogleCommonOperationName,
} from '@easybread/adapter-google-common';
import { GoogleAdminDirectoryAuthScope } from '@easybread/adapter-google-admin-directory';
import { redirect } from 'next/navigation';
import { ADAPTER_NAME, makeBreadId } from 'playground-common';
import { adapterCollection } from 'playground-db';
import { randomBytes } from 'node:crypto';

export const adapterGoogleAuthStart = async (userId: string) => {
  const connectionToken = randomBytes(16).toString('hex');
  const clientGoogleAdminDirectory = await clientGoogleAdminDirectoryGet();

  await adapterCollection().updateOne(
    {
      userId,
      slug: ADAPTER_NAME.GOOGLE_ADMIN_DIRECTORY,
    },
    { $set: { createdAt: new Date(), isConnected: false, connectionToken } },
    { upsert: true }
  );

  const result =
    await clientGoogleAdminDirectory.invoke<GoogleCommonOauth2StartOperation>({
      name: GoogleCommonOperationName.AUTH_FLOW_START,
      breadId: makeBreadId(userId),
      payload: {
        prompt: ['consent'],
        includeGrantedScopes: true,
        loginHint: 'hint',
        scope: [
          'https://www.googleapis.com/auth/admin.directory.user',
          'https://www.googleapis.com/auth/admin.directory.user.readonly',
          'https://www.googleapis.com/auth/cloud-platform',
        ] satisfies GoogleAdminDirectoryAuthScope[],
        state: connectionToken,
      },
    });

  if (!result.rawPayload.success) {
    throw new Error('adapterGoogleAuthStart failed', {
      cause: result.rawPayload,
    });
  }

  redirect(result.rawPayload.data.authUri);
};
