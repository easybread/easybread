import type { CommandHandler } from '@easybread/core';

import type { GoogleAdminDirectoryUserSearchCommand } from '../commands';
import {
  googleAdminDirectoryPaginationAdapter,
  googleAdminDirectoryUserAdapter,
} from '../data-adapters';
import type { GoogleAdminDirectoryAuthStrategy } from '../google-admin-directory.auth-strategy';
import { GOOGLE_ADMIN_DIRECTORY_COMMAND_NAME } from '../google-admin-directory.command-name';
import type { GoogleAdminDirectoryUsersList } from '../interfaces';

export const GoogleAdminDirectoryUsersSearchHandler: CommandHandler<
  GoogleAdminDirectoryUserSearchCommand,
  GoogleAdminDirectoryAuthStrategy
> = {
  name: GOOGLE_ADMIN_DIRECTORY_COMMAND_NAME.BASIC_USER_SEARCH,
  async handle(input, context) {
    const { breadId, params, pagination } = input;
    const { query } = params;
    const { maxResults = 300, pageToken } =
      googleAdminDirectoryPaginationAdapter.toExternalParams(pagination);

    const response = await context.httpRequest<GoogleAdminDirectoryUsersList>({
      method: 'GET',
      url: 'https://www.googleapis.com/admin/directory/v1/users',
      params: {
        customer: 'my_customer',
        // See https://developers.google.com/admin-sdk/directory/v1/guides/search-users
        query,
        maxResults,
        pageToken,
      },
    });

    return {
      success: true,
      breadId,
      payload: (response.data.users ?? []).map(
        googleAdminDirectoryUserAdapter.toInternal,
      ),
      pagination: googleAdminDirectoryPaginationAdapter.toInternalData({
        ...response.data,
        currentPageToken: pageToken,
      }),
      rawPayload: response.data,
    };
  },
};
