import { RocketChatLoginToken } from './rocket-chat.login-token';
import { RocketChatPersonalAccessToken } from './rocket-chat.personal-access-token';

export type RocketChatLoginTokenUnion = RocketChatLoginToken &
  RocketChatPersonalAccessToken;
