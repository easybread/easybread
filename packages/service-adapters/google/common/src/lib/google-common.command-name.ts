import { BREAD_COMMAND_NAME } from '@easybread/commands';
import { enumPickKeys } from '@easybread/common';

export const GOOGLE_COMMON_COMMAND_NAME = enumPickKeys(BREAD_COMMAND_NAME, [
  'AUTH_OAUTH2_START',
  'AUTH_OAUTH2_COMPLETE',
]);
