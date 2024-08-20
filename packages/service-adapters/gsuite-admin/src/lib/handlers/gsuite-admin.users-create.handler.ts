import {
  BreadOperationHandler,
  createSuccessfulOutputWithRawDataAndPayload
} from '@easybread/core';

import { GsuiteAdminUserMapper } from '../data-mappers';
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

    const mapper = new GsuiteAdminUserMapper();

    const response = await context.httpRequest<GsuiteAdminUser>({
      method: 'POST',
      url: 'https://www.googleapis.com/admin/directory/v1/users',
      data: mapper.toRemote(payload)
    });

    return createSuccessfulOutputWithRawDataAndPayload(
      name,
      response.data,
      mapper.toSchema(response.data)
    );
  },

  name: GsuiteAdminOperationName.USERS_CREATE
};
