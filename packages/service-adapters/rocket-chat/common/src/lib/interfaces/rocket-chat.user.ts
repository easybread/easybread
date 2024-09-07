import { RocketChatBanner } from './rocket-chat.banner';
import { RocketChatUserEmail } from './rocket-chat.user-email';
import { RocketChatUserServices } from './rocket-chat.user-services';
import { RocketChatUserSettings } from './rocket-chat.user-settings';

export type RocketChatUser = {
  _id?: string;

  type: string;
  active: boolean;
  username?: string;
  name?: string;
  services?: RocketChatUserServices;
  emails?: RocketChatUserEmail[];
  status?: string;
  statusConnection?: string;
  lastLogin?: Date;
  avatarOrigin?: string;
  utcOffset?: number;
  language?: string;
  statusDefault?: string;
  oauth?: { authorizedClients: string[] };
  _updatedAt?: Date;
  statusLivechat?: string;
  e2e?: {
    private_key: string;
    public_key: string;
  };
  requirePasswordChange?: boolean;
  customFields?: {
    [key: string]: unknown;
  };
  settings?: RocketChatUserSettings;

  // seem to be optional in real API response but required in RC docs:
  createdAt?: Date;
  roles?: string[];

  // not present in RC docs:
  __rooms?: string[];
  appId?: string;
  statusText?: string;
  banners?: Record<string, RocketChatBanner>;
};
