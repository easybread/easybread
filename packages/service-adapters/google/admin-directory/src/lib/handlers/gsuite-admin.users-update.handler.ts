import {
  BreadOperationHandler,
  createSuccessfulOutputWithRawDataAndPayload,
} from '@easybread/core';

import { gsuiteAdminUserAdapter } from '../data-adapters';
import { GsuiteAdminAuthStrategy } from '../gsuite-admin.auth-strategy';
import { GsuiteAdminOperationName } from '../gsuite-admin.operation-name';
import { GsuiteAdminUser } from '../interfaces';
import { GsuiteAdminUsersUpdateOperation } from '../operations';

export const GsuiteAdminUsersUpdateHandler: BreadOperationHandler<
  GsuiteAdminUsersUpdateOperation,
  GsuiteAdminAuthStrategy
> = {
  async handle(input, context) {
    const { name, payload } = input;

    const result = await context.httpRequest<GsuiteAdminUser>({
      method: 'PUT',
      url: `https://www.googleapis.com/admin/directory/v1/users/${payload.identifier}`,
      data: gsuiteAdminUserAdapter.toExternal(payload),
    });

    return createSuccessfulOutputWithRawDataAndPayload(
      name,
      result.data,
      gsuiteAdminUserAdapter.toInternal(result.data)
    );
  },

  name: GsuiteAdminOperationName.USERS_UPDATE,
};
