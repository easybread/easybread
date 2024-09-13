export type RocketChatLoginToken = {
  hashedToken: string;
  twoFactorAuthorizedUntil?: Date;
  twoFactorAuthorizedHash?: string;
};
