import {
  BreadOperationHandler,
  createSuccessfulOutputWithPayload,
} from '@easybread/core';

import { GoogleAdminDirectoryAuthStrategy } from '../google-admin-directory.auth-strategy';
import { GoogleAdminDirectoryOperationName } from '../google-admin-directory.operation-name';
import { GoogleAdminDirectoryUser } from '../interfaces';
import { GoogleAdminDirectoryUsersDeleteOperation } from '../operations';

export const GoogleAdminDirectoryUsersDeleteHandler: BreadOperationHandler<
  GoogleAdminDirectoryUsersDeleteOperation,
  GoogleAdminDirectoryAuthStrategy
> = {
  name: GoogleAdminDirectoryOperationName.USERS_DELETE,
  async handle(input, context) {
    const { name, payload } = input;

    await context.httpRequest<GoogleAdminDirectoryUser>({
      method: 'DELETE',
      url: `https://www.googleapis.com/admin/directory/v1/users/${payload.identifier}`,
    });

    return createSuccessfulOutputWithPayload(name, payload);
  },
};
