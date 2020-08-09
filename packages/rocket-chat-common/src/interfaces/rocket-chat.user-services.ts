import { RocketChatLoginTokenUnion } from './rocket-chat.login-token-union';
import { RocketChatUserEmailCode } from './rocket-chat.user-email-code';
import { RocketChatUserEmailVerificationToken } from './rocket-chat.user-email-verification-token';

export interface RocketChatUserServices {
  password?: {
    bcrypt: string;
  };
  email?: {
    verificationTokens?: RocketChatUserEmailVerificationToken[];
  };
  resume?: {
    loginTokens?: RocketChatLoginTokenUnion[];
  };
  google?: unknown;
  facebook?: unknown;
  github?: unknown;
  totp?: {
    enabled: boolean;
    hashedBackup: string[];
    secret: string;
  };
  email2fa?: {
    enabled: boolean;
    changedAt: Date;
  };
  emailCode: RocketChatUserEmailCode[];
}
