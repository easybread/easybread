import { RocketChatLoginToken } from './rocket-chat.login-token';

export interface RocketChatPersonalAccessToken extends RocketChatLoginToken {
  type: 'personalAccessToken';
  createdAt: Date;
  lastTokenPart: string;
  name?: string;
  bypassTwoFactor?: boolean;
}
