import type { CommandHandler } from '@easybread/core';

import type { GoogleAdminDirectoryUserCreateCommand } from '../commands';
import { googleAdminDirectoryUserAdapter } from '../data-adapters';
import type { GoogleAdminDirectoryAuthStrategy } from '../google-admin-directory.auth-strategy';
import { GOOGLE_ADMIN_DIRECTORY_COMMAND_NAME } from '../google-admin-directory.command-name';
import type { GoogleAdminDirectoryUser } from '../interfaces';

export const GoogleAdminDirectoryUsersCreateHandler: CommandHandler<
  GoogleAdminDirectoryUserCreateCommand,
  GoogleAdminDirectoryAuthStrategy
> = {
  name: GOOGLE_ADMIN_DIRECTORY_COMMAND_NAME.BASIC_USER_CREATE,

  async handle(input, context) {
    const { payload, breadId } = input;

    const response = await context.httpRequest<GoogleAdminDirectoryUser>({
      method: 'POST',
      url: 'https://www.googleapis.com/admin/directory/v1/users',
      data: googleAdminDirectoryUserAdapter.toExternal(payload),
    });

    return {
      success: true,
      breadId,
      payload: googleAdminDirectoryUserAdapter.toInternal(response.data),
      rawPayload: response.data,
    };
  },
};
