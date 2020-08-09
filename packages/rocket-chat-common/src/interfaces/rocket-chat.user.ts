import { RocketChatUserEmail } from './rocket-chat.user-email';
import { RocketChatUserServices } from './rocket-chat.user-services';
import { RocketChatUserSettings } from './rocket-chat.user-settings';

export interface RocketChatUser {
  _id: string;
  statusText?: string;
  createdAt?: Date;
  roles?: string[];
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
  oauth?: {
    authorizedClients: string[];
  };
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
}
