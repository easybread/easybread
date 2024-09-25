import {
  BreadOperationHandler,
  createSuccessfulOutputWithRawDataAndPayload,
} from '@easybread/core';

import { GoogleAdminDirectoryAuthStrategy } from '../google-admin-directory.auth-strategy';
import { GoogleAdminDirectoryOperationName } from '../google-admin-directory.operation-name';
import { GoogleAdminDirectoryUser } from '../interfaces';
import { GoogleAdminDirectoryUsersByIdOperation } from '../operations';
import { googleAdminDirectoryUserAdapter } from '../data-adapters';

export const GoogleAdminDirectoryUserByIdHandler: BreadOperationHandler<
  GoogleAdminDirectoryUsersByIdOperation,
  GoogleAdminDirectoryAuthStrategy
> = {
  name: GoogleAdminDirectoryOperationName.USERS_BY_ID,

  async handle(input, context) {
    const {
      name,
      params: { identifier },
    } = input;

    const result = await context.httpRequest<GoogleAdminDirectoryUser>({
      method: 'GET',
      url: `https://www.googleapis.com/admin/directory/v1/users/${identifier}`,
    });

    return createSuccessfulOutputWithRawDataAndPayload(
      name,
      result.data,
      googleAdminDirectoryUserAdapter.toInternal(result.data)
    );
  },
};
