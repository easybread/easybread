import { type CommandHandler } from '@easybread/core';

import { GoogleAdminDirectoryUserByIdCommand } from '../commands';
import { googleAdminDirectoryUserAdapter } from '../data-adapters';
import { GoogleAdminDirectoryAuthStrategy } from '../google-admin-directory.auth-strategy';
import { GOOGLE_ADMIN_DIRECTORY_COMMAND_NAME } from '../google-admin-directory.command-name';
import { GoogleAdminDirectoryUser } from '../interfaces';

export const GoogleAdminDirectoryUserByIdHandler: CommandHandler<
  GoogleAdminDirectoryUserByIdCommand,
  GoogleAdminDirectoryAuthStrategy
> = {
  name: GOOGLE_ADMIN_DIRECTORY_COMMAND_NAME.BASIC_USER_BY_ID,

  async handle(input, context) {
    const {
      params: { identifier },
      breadId,
    } = input;

    const result = await context.httpRequest<GoogleAdminDirectoryUser>({
      method: 'GET',
      url: `https://www.googleapis.com/admin/directory/v1/users/${identifier}`,
    });

    return {
      success: true,
      breadId,
      payload: googleAdminDirectoryUserAdapter.toInternal(result.data),
      rawPayload: result.data,
    };
  },
};
