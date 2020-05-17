import { BreadOperationHandler } from '@easybread/core';

import { GsuiteAdminUserMapper } from '../data-mappers';
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

    const mapper = new GsuiteAdminUserMapper();

    const result = await context.httpRequest<GsuiteAdminUser>({
      method: 'PUT',
      url: `https://www.googleapis.com/admin/directory/v1/users/${payload.identifier}`,
      data: mapper.toRemote(payload)
    });

    return {
      name,
      payload: mapper.toSchema(result.data),
      rawPayload: { success: true, data: result.data }
    };
  },

  name: GsuiteAdminOperationName.USERS_UPDATE
};
