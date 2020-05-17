import { BreadOperationHandler } from '@easybread/core';

import { GsuiteAdminAuthStrategy } from '../gsuite-admin.auth-strategy';
import { GsuiteAdminOperationName } from '../gsuite-admin.operation-name';
import { GsuiteAdminUser } from '../interfaces';
import { GsuiteAdminUsersDeleteOperation } from '../operations';

export const GsuiteAdminUsersDeleteHandler: BreadOperationHandler<
  GsuiteAdminUsersDeleteOperation,
  GsuiteAdminAuthStrategy
> = {
  name: GsuiteAdminOperationName.USERS_DELETE,
  async handle(input, context) {
    const { name, payload } = input;

    await context.httpRequest<GsuiteAdminUser>({
      method: 'DELETE',
      url: `https://www.googleapis.com/admin/directory/v1/users/${payload.identifier}`
    });

    return { name, payload, rawPayload: { success: true } };
  }
};
