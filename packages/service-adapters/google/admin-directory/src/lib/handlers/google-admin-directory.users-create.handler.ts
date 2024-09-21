import {
  BreadOperationHandler,
  createSuccessfulOutputWithRawDataAndPayload,
} from '@easybread/core';

import { googleAdminDirectoryUserAdapter } from '../data-adapters';
import { GoogleAdminDirectoryAuthStrategy } from '../google-admin-directory.auth-strategy';
import { GoogleAdminDirectoryOperationName } from '../google-admin-directory.operation-name';
import { GoogleAdminDirectoryUser } from '../interfaces';
import { GoogleAdminDirectoryUsersCreateOperation } from '../operations';

export const GoogleAdminDirectoryUsersCreateHandler: BreadOperationHandler<
  GoogleAdminDirectoryUsersCreateOperation,
  GoogleAdminDirectoryAuthStrategy
> = {
  async handle(input, context) {
    const { name, payload } = input;

    const response = await context.httpRequest<GoogleAdminDirectoryUser>({
      method: 'POST',
      url: 'https://www.googleapis.com/admin/directory/v1/users',
      data: googleAdminDirectoryUserAdapter.toExternal(payload),
    });

    return createSuccessfulOutputWithRawDataAndPayload(
      name,
      response.data,
      googleAdminDirectoryUserAdapter.toInternal(response.data)
    );
  },

  name: GoogleAdminDirectoryOperationName.USERS_CREATE,
};
