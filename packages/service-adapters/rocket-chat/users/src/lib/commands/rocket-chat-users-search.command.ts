import { type CommandPaginated, PAGINATION_TYPE } from '@easybread/core';
import type { PersonSchema, SearchActionSchema } from '@easybread/schemas';

import type { RocketChatUsersList } from '../interfaces';
import { ROCKET_CHAT_USERS_COMMAND_NAME } from '../rocket-chat-users.command-name';

export type RocketChatUsersSearchCommand = CommandPaginated<
  typeof PAGINATION_TYPE.OFFSET,
  typeof ROCKET_CHAT_USERS_COMMAND_NAME.BASIC_USER_SEARCH,
  SearchActionSchema,
  PersonSchema[],
  RocketChatUsersList
>;
