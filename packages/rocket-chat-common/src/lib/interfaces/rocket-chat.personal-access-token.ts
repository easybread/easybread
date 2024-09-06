import { RocketChatLoginToken } from './rocket-chat.login-token';

export type RocketChatPersonalAccessToken = RocketChatLoginToken & {
  type: 'personalAccessToken';
  createdAt: Date;
  lastTokenPart: string;
  name?: string;
  bypassTwoFactor?: boolean;
};
