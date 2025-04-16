import { type CommandHandler } from '@easybread/core';

import type { GoogleAdminDirectoryUserUpdateCommand } from '../commands';
import { googleAdminDirectoryUserAdapter } from '../data-adapters';
import type { GoogleAdminDirectoryAuthStrategy } from '../google-admin-directory.auth-strategy';
import { GOOGLE_ADMIN_DIRECTORY_COMMAND_NAME } from '../google-admin-directory.command-name';
import type { GoogleAdminDirectoryUser } from '../interfaces';

export const GoogleAdminDirectoryUsersUpdateHandler: CommandHandler<
  GoogleAdminDirectoryUserUpdateCommand,
  GoogleAdminDirectoryAuthStrategy
> = {
  name: GOOGLE_ADMIN_DIRECTORY_COMMAND_NAME.BASIC_USER_UPDATE,

  async handle(input, context) {
    const { breadId, payload, params } = input;

    const result = await context.httpRequest<GoogleAdminDirectoryUser>({
      method: 'PUT',
      url: `https://www.googleapis.com/admin/directory/v1/users/${params.identifier}`,
      data: googleAdminDirectoryUserAdapter.toExternal(payload),
    });

    return {
      success: true,
      breadId,
      payload: googleAdminDirectoryUserAdapter.toInternal(result.data),
      rawPayload: result.data,
    };
  },
};
