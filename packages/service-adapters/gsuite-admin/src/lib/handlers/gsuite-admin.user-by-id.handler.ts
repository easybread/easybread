import {
  BreadOperationHandler,
  createSuccessfulOutputWithRawDataAndPayload
} from '@easybread/core';

import { GsuiteAdminUserMapper } from '../data-mappers';
import { GsuiteAdminAuthStrategy } from '../gsuite-admin.auth-strategy';
import { GsuiteAdminOperationName } from '../gsuite-admin.operation-name';
import { GsuiteAdminUser } from '../interfaces';
import { GsuiteAdminUsersByIdOperation } from '../operations';

export const GsuiteAdminUserByIdHandler: BreadOperationHandler<
  GsuiteAdminUsersByIdOperation,
  GsuiteAdminAuthStrategy
> = {
  name: GsuiteAdminOperationName.USERS_BY_ID,

  async handle(input, context) {
    const {
      name,
      params: { identifier }
    } = input;

    const result = await context.httpRequest<GsuiteAdminUser>({
      method: 'GET',
      url: `https://www.googleapis.com/admin/directory/v1/users/${identifier}`
    });

    const adminUserMapper = new GsuiteAdminUserMapper();

    return createSuccessfulOutputWithRawDataAndPayload(
      name,
      result.data,
      adminUserMapper.toSchema(result.data)
    );
  }
};
