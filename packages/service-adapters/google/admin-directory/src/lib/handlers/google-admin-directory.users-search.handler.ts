import {
  BreadOperationHandler,
  createSuccessfulCollectionOutputWithRawDataAndPayload,
} from '@easybread/core';

import {
  googleAdminDirectoryPaginationAdapter,
  googleAdminDirectoryUserAdapter,
} from '../data-adapters';
import { GoogleAdminDirectoryAuthStrategy } from '../google-admin-directory.auth-strategy';
import { GoogleAdminDirectoryOperationName } from '../google-admin-directory.operation-name';
import { GoogleAdminDirectoryUsersList } from '../interfaces';
import { GoogleAdminDirectoryUsersSearchOperation } from '../operations';

export const GoogleAdminDirectoryUsersSearchHandler: BreadOperationHandler<
  GoogleAdminDirectoryUsersSearchOperation,
  GoogleAdminDirectoryAuthStrategy
> = {
  async handle(input, context) {
    const { name, params, pagination } = input;
    const { query } = params;

    const response = await context.httpRequest<GoogleAdminDirectoryUsersList>({
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
        ...googleAdminDirectoryPaginationAdapter.toExternalParams(pagination),
      },
    });

    return createSuccessfulCollectionOutputWithRawDataAndPayload(
      name,
      response.data,
      (response.data.users ?? []).map(
        googleAdminDirectoryUserAdapter.toInternal
      ),
      googleAdminDirectoryPaginationAdapter.toInternalData(response.data)
    );
  },

  name: GoogleAdminDirectoryOperationName.USERS_SEARCH,
};
