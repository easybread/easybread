import { type CommandStandard } from '@easybread/core';
import { PersonSchema, type SchemaPick } from '@easybread/schemas';

import type { RocketChatUsersInfo } from '../interfaces';
import { ROCKET_CHAT_USERS_COMMAND_NAME } from '../rocket-chat-users.command-name';

export type RocketChatUsersByIdCommand = CommandStandard<
  typeof ROCKET_CHAT_USERS_COMMAND_NAME.BASIC_USER_BY_ID,
  SchemaPick<PersonSchema, 'identifier'> | SchemaPick<PersonSchema, 'email'>,
  null,
  PersonSchema,
  RocketChatUsersInfo
>;
