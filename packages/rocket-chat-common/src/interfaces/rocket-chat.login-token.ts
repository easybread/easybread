export interface RocketChatLoginToken {
  hashedToken: string;
  twoFactorAuthorizedUntil?: Date;
  twoFactorAuthorizedHash?: string;
}
