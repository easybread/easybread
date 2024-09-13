import {
  BreadOperationHandler,
  createSuccessfulCollectionOutputWithRawDataAndPayload,
} from '@easybread/core';

import {
  gsuiteAdminPaginationAdapter,
  gsuiteAdminUserAdapter,
} from '../data-adapters';
import { GsuiteAdminAuthStrategy } from '../gsuite-admin.auth-strategy';
import { GsuiteAdminOperationName } from '../gsuite-admin.operation-name';
import { GsuiteAdminUsersList } from '../interfaces';
import { GsuiteAdminUsersSearchOperation } from '../operations';

export const GsuiteAdminUsersSearchHandler: BreadOperationHandler<
  GsuiteAdminUsersSearchOperation,
  GsuiteAdminAuthStrategy
> = {
  async handle(input, context) {
    const { name, params, pagination } = input;
    const { query } = params;

    const response = await context.httpRequest<GsuiteAdminUsersList>({
      method: 'GET',
      url: 'https://www.googleapis.com/admin/directory/v1/users',
      params: {
        customer: 'my_customer',
        // TODO: think about the best value.
        maxResults: 300,
        // TODO: implement pagination handling
        // pageToken: 'token',
        // See https://developers.google.com/admin-sdk/directory/v1/guides/search-users
        query,
        ...gsuiteAdminPaginationAdapter.toExternalParams(pagination),
      },
    });

    return createSuccessfulCollectionOutputWithRawDataAndPayload(
      name,
      response.data,
      response.data.users.map(gsuiteAdminUserAdapter.toInternal),
      gsuiteAdminPaginationAdapter.toInternalData(response.data)
    );
  },
  name: GsuiteAdminOperationName.USERS_SEARCH,
};
