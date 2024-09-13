import {
  BreadOperationHandler,
  createSuccessfulOutputWithRawDataAndPayload,
} from '@easybread/core';

import { gsuiteAdminUserAdapter } from '../data-adapters';
import { GsuiteAdminAuthStrategy } from '../gsuite-admin.auth-strategy';
import { GsuiteAdminOperationName } from '../gsuite-admin.operation-name';
import { GsuiteAdminUser } from '../interfaces';
import { GsuiteAdminUsersCreateOperation } from '../operations';

export const GsuiteAdminUsersCreateHandler: BreadOperationHandler<
  GsuiteAdminUsersCreateOperation,
  GsuiteAdminAuthStrategy
> = {
  async handle(input, context) {
    const { name, payload } = input;

    const response = await context.httpRequest<GsuiteAdminUser>({
      method: 'POST',
      url: 'https://www.googleapis.com/admin/directory/v1/users',
      data: gsuiteAdminUserAdapter.toExternal(payload),
    });

    return createSuccessfulOutputWithRawDataAndPayload(
      name,
      response.data,
      gsuiteAdminUserAdapter.toInternal(response.data)
    );
  },

  name: GsuiteAdminOperationName.USERS_CREATE,
};
