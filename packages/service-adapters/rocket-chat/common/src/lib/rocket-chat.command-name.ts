import { BREAD_COMMAND_NAME } from '@easybread/commands';
import { enumPickKeys } from '@easybread/common';

export const ROCKET_CHAT_COMMAND_NAME = enumPickKeys(BREAD_COMMAND_NAME, [
  'AUTH_BASIC_SET',
]);
