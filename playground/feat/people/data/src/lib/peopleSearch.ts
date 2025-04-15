import { BAMBOO_HR_COMMAND_NAME } from '@easybread/adapter-bamboo-hr';
import { GOOGLE_ADMIN_DIRECTORY_COMMAND_NAME } from '@easybread/adapter-google-admin-directory';
import { ADAPTER_NAME, type AdapterName, makeBreadId } from 'playground-common';
import {
  clientBambooHrGet,
  clientGoogleAdminDirectoryGet,
} from 'playground-easybread-clients';

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
      return await clientGoogleAdminDirectory.invoke(
        GOOGLE_ADMIN_DIRECTORY_COMMAND_NAME.BASIC_USER_SEARCH,
        {
          breadId: makeBreadId(userId),
          pagination: { type: 'CURSOR' },
          params: { '@type': 'SearchAction', query },
        },
      );
    }

    case ADAPTER_NAME.BAMBOO_HR: {
      const clientBambooHr = await clientBambooHrGet();
      return await clientBambooHr.invoke(
        BAMBOO_HR_COMMAND_NAME.HR_EMPLOYEE_SEARCH,
        {
          breadId: makeBreadId(userId),
          params: { query, '@type': 'SearchAction' },
          pagination: { type: 'DISABLED' },
        },
      );
    }

    default:
      throw new Error(`Unknown adapter ${adapter}`);
  }
}
