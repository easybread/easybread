import {
  BreadOperationHandler,
  createSuccessfulOutputWithRawDataAndPayload,
} from '@easybread/core';

import { GsuiteAdminAuthStrategy } from '../gsuite-admin.auth-strategy';
import { GsuiteAdminOperationName } from '../gsuite-admin.operation-name';
import { GsuiteAdminUser } from '../interfaces';
import { GsuiteAdminUsersByIdOperation } from '../operations';
import { gsuiteAdminUserAdapter } from '../data-adapters';

export const GsuiteAdminUserByIdHandler: BreadOperationHandler<
  GsuiteAdminUsersByIdOperation,
  GsuiteAdminAuthStrategy
> = {
  name: GsuiteAdminOperationName.USERS_BY_ID,

  async handle(input, context) {
    const {
      name,
      params: { identifier },
    } = input;

    const result = await context.httpRequest<GsuiteAdminUser>({
      method: 'GET',
      url: `https://www.googleapis.com/admin/directory/v1/users/${identifier}`,
    });

    return createSuccessfulOutputWithRawDataAndPayload(
      name,
      result.data,
      gsuiteAdminUserAdapter.toInternal(result.data)
    );
  },
};
