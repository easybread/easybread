import { GOOGLE_COMMON_COMMAND_NAME } from '@easybread/adapter-google-common';
import { BREAD_COMMAND_NAME } from '@easybread/commands';
import { enumMerge, enumPickKeys } from '@easybread/common';

export const GOOGLE_ADMIN_DIRECTORY_COMMAND_NAME = enumMerge(
  enumPickKeys(GOOGLE_COMMON_COMMAND_NAME, [
    'AUTH_OAUTH2_START',
    'AUTH_OAUTH2_COMPLETE',
  ]),
  enumPickKeys(BREAD_COMMAND_NAME, [
    'BASIC_USER_SEARCH',
    'BASIC_USER_BY_ID',
    'BASIC_USER_CREATE',
    'BASIC_USER_UPDATE',
    'BASIC_USER_DELETE',
  ]),
);
