import {
  RocketChatPaginationData,
  RocketChatUser,
} from '@easybread/adapter-rocket-chat-common';

export interface RocketChatUsersList extends RocketChatPaginationData {
  success: boolean;
  users: RocketChatUser[];
}
