import { BreadOperationHandler } from '@easybread/core';

import { GsuiteAdminUserMapper } from '../data-mappers';
import { GsuiteAdminAuthStrategy } from '../gsuite-admin.auth-strategy';
import { GsuiteAdminOperationName } from '../gsuite-admin.operation-name';
import { GsuiteAdminUsersList } from '../interfaces';
import { GsuiteAdminUsersSearchOperation } from '../operations';

export const GsuiteAdminUsersSearchHandler: BreadOperationHandler<
  GsuiteAdminUsersSearchOperation,
  GsuiteAdminAuthStrategy
> = {
  async handle(input, context) {
    const { name, params } = input;
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
        query
      }
    });

    const userMapper = new GsuiteAdminUserMapper();
    return {
      name,
      payload: response.data.users.map(user => userMapper.toSchema(user)),
      rawPayload: {
        success: true,
        data: response.data
      }
    };
  },
  name: GsuiteAdminOperationName.USERS_SEARCH
};
