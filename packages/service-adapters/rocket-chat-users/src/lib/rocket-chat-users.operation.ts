import { RocketChatAuthConfigureOperation } from '@easybread/rocket-chat-common';

import {
  RocketChatUsersByIdOperation,
  RocketChatUsersSearchOperation
} from './operations';

export type RocketChatUsersOperation =
  | RocketChatAuthConfigureOperation
  | RocketChatUsersSearchOperation
  | RocketChatUsersByIdOperation;
