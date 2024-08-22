import {
  RocketChatPaginationData,
  RocketChatUser
} from '@easybread/rocket-chat-common';

export interface RocketChatUsersList extends RocketChatPaginationData {
  success: boolean;
  users: RocketChatUser[];
}
