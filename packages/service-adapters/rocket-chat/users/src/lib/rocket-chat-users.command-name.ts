import { ROCKET_CHAT_COMMAND_NAME } from '@easybread/adapter-rocket-chat-common';
import { BREAD_COMMAND_NAME } from '@easybread/commands';
import { enumMerge, enumPickKeys } from '@easybread/common';

export const ROCKET_CHAT_USERS_COMMAND_NAME = enumMerge(
  ROCKET_CHAT_COMMAND_NAME,
  enumPickKeys(BREAD_COMMAND_NAME, ['BASIC_USER_SEARCH', 'BASIC_USER_BY_ID']),
);
