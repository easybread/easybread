import {
  BreadOperationHandler,
  createSuccessfulOutputWithRawDataAndPayload,
} from '@easybread/core';

import { googleAdminDirectoryUserAdapter } from '../data-adapters';
import { GoogleAdminDirectoryOperationName } from '../google-admin-directory.operation-name';
import { GoogleAdminDirectoryUser } from '../interfaces';
import { GoogleAdminDirectoryUsersUpdateOperation } from '../operations';
import type { GoogleAdminDirectoryAuthStrategy } from '../google-admin-directory.auth-strategy';

export const GoogleAdminDirectoryUsersUpdateHandler: BreadOperationHandler<
  GoogleAdminDirectoryUsersUpdateOperation,
  GoogleAdminDirectoryAuthStrategy
> = {
  async handle(input, context) {
    const { name, payload } = input;

    const result = await context.httpRequest<GoogleAdminDirectoryUser>({
      method: 'PUT',
      url: `https://www.googleapis.com/admin/directory/v1/users/${payload.identifier}`,
      data: googleAdminDirectoryUserAdapter.toExternal(payload),
    });

    return createSuccessfulOutputWithRawDataAndPayload(
      name,
      result.data,
      googleAdminDirectoryUserAdapter.toInternal(result.data)
    );
  },

  name: GoogleAdminDirectoryOperationName.USERS_UPDATE,
};
