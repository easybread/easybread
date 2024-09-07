import { RocketChatAuthConfigureOperation } from '@easybread/adapter-rocket-chat-common';

import {
  RocketChatUsersByIdOperation,
  RocketChatUsersSearchOperation,
} from './operations';

export type RocketChatUsersOperation =
  | RocketChatAuthConfigureOperation
  | RocketChatUsersSearchOperation
  | RocketChatUsersByIdOperation;
