import {
  clientBambooHrGet,
  clientGoogleAdminDirectoryGet,
} from 'playground-easybread-clients';
import {
  GoogleAdminDirectoryOperationName,
  type GoogleAdminDirectoryUsersSearchOperation,
} from '@easybread/adapter-google-admin-directory';
import { ADAPTER_NAME, type AdapterName, makeBreadId } from 'playground-common';
import { BreadOperationName } from '@easybread/operations';
import type { BambooHrEmployeeSearchOperation } from '@easybread/adapter-bamboo-hr';

interface PeopleSearchParams {
  userId: string;
  adapter: AdapterName;
  query?: string;
}

export async function peopleSearch({
  userId,
  adapter,
  query,
}: PeopleSearchParams) {
  switch (adapter) {
    case ADAPTER_NAME.GOOGLE_ADMIN_DIRECTORY: {
      const clientGoogleAdminDirectory = await clientGoogleAdminDirectoryGet();
      return await clientGoogleAdminDirectory.invoke<GoogleAdminDirectoryUsersSearchOperation>(
        {
          name: GoogleAdminDirectoryOperationName.USERS_SEARCH,
          breadId: makeBreadId(userId),
          pagination: { type: 'PREV_NEXT' },
          params: { query },
        }
      );
    }

    case ADAPTER_NAME.BAMBOO_HR: {
      const clientBambooHr = await clientBambooHrGet();
      return await clientBambooHr.invoke<BambooHrEmployeeSearchOperation>({
        breadId: makeBreadId(userId),
        name: BreadOperationName.EMPLOYEE_SEARCH,
        params: { query },
        pagination: { type: 'DISABLED' },
      });
    }

    default:
      throw new Error(`Unknown adapter ${adapter}`);
  }
}
