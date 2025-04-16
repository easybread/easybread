import { BAMBOO_HR_COMMAND_NAME } from '@easybread/adapter-bamboo-hr';
import { BREEZY_COMMAND_NAME } from '@easybread/adapter-breezy';
import { GOOGLE_ADMIN_DIRECTORY_COMMAND_NAME } from '@easybread/adapter-google-admin-directory';
import { ADAPTER_NAME, makeBreadId } from 'playground-common';
import {
  clientBambooHrGet,
  clientBreezyGet,
  clientGoogleAdminDirectoryGet,
} from 'playground-easybread-clients';

import type { PeopleSearchParams } from './peopleSearchParams';

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

    case ADAPTER_NAME.BREEZY: {
      const clientBreezy = await clientBreezyGet();
      return await clientBreezy.invoke(
        BREEZY_COMMAND_NAME.HR_JOB_APPLICANT_SEARCH,
        {
          breadId: makeBreadId(userId),
          params: null,
          pagination: { type: 'DISABLED' },
        },
      );
    }

    default:
      throw new Error(`Unknown adapter ${adapter satisfies never}`);
  }
}
