import { clientGoogleAdminDirectory } from 'playground-easybread-clients';
import {
  GoogleAdminDirectoryOperationName,
  type GoogleAdminDirectoryUsersSearchOperation,
} from '@easybread/adapter-google-admin-directory';
import { ADAPTER_NAME, type AdapterName, makeBreadId } from 'playground-common';

interface PeopleSearchParams {
  userId: string;
  adapter: AdapterName;
  query?: string;
}

export function peopleSearch({ userId, adapter, query }: PeopleSearchParams) {
  switch (adapter) {
    case ADAPTER_NAME.GOOGLE_ADMIN_DIRECTORY:
      return clientGoogleAdminDirectory.invoke<GoogleAdminDirectoryUsersSearchOperation>(
        {
          breadId: makeBreadId(userId),
          name: GoogleAdminDirectoryOperationName.USERS_SEARCH,
          pagination: { type: 'PREV_NEXT' },
          params: { query },
        }
      );

    default:
      throw new Error(`Unknown adapter ${adapter}`);
  }
}
