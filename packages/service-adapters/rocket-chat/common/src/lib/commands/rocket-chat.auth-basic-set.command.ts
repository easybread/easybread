import { type CommandStandard } from '@easybread/core';
import type { AuthCredentialBasicSchema } from '@easybread/schemas';

import { ROCKET_CHAT_COMMAND_NAME } from '../rocket-chat.command-name';

export type RocketChatAuthBasicSetCommand = CommandStandard<
  typeof ROCKET_CHAT_COMMAND_NAME.AUTH_BASIC_SET,
  null,
  AuthCredentialBasicSchema,
  null,
  null
>;
