import type { CommandHandler } from '@easybread/core';

import type { GoogleAdminDirectoryUserDeleteCommand } from '../commands';
import type { GoogleAdminDirectoryAuthStrategy } from '../google-admin-directory.auth-strategy';
import { GOOGLE_ADMIN_DIRECTORY_COMMAND_NAME } from '../google-admin-directory.command-name';
import type { GoogleAdminDirectoryUser } from '../interfaces';

export const GoogleAdminDirectoryUsersDeleteHandler: CommandHandler<
  GoogleAdminDirectoryUserDeleteCommand,
  GoogleAdminDirectoryAuthStrategy
> = {
  name: GOOGLE_ADMIN_DIRECTORY_COMMAND_NAME.BASIC_USER_DELETE,
  async handle(input, context) {
    const { breadId, params } = input;

    await context.httpRequest<GoogleAdminDirectoryUser>({
      method: 'DELETE',
      url: `https://www.googleapis.com/admin/directory/v1/users/${params.identifier}`,
    });

    return {
      success: true,
      breadId,
      payload: null,
      rawPayload: null,
    };
  },
};
