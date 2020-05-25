import {
  BreadOperationHandler,
  createSuccessfulCollectionOutputWithRawDataAndPayload
} from '@easybread/core';

import {
  GsuiteAdminUserMapper,
  GsuiteAdminUsersPaginationMapper
} from '../data-mappers';
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

    const paginationMapper = new GsuiteAdminUsersPaginationMapper();

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
        ...paginationMapper.toRemoteParams(pagination)
      }
    });

    const userMapper = new GsuiteAdminUserMapper();

    return createSuccessfulCollectionOutputWithRawDataAndPayload(
      name,
      response.data,
      response.data.users.map(user => userMapper.toSchema(user)),
      paginationMapper.toOutputPagination(response.data)
    );
  },
  name: GsuiteAdminOperationName.USERS_SEARCH
};
