import { RocketChatUsersInfo } from '../interfaces';

export const USERS_INFO_MOCK: RocketChatUsersInfo = {
  user: {
    _id: 'id1',
    type: 'user',
    status: 'offline',
    active: true,
    name: 'User One',
    utcOffset: -4,
    username: 'user.one',
    statusText: '',
    language: '',
    banners: {
      'alert-1': {
        id: 'alert-1',
        priority: 10,
        title: 'Notice',
        text:
          'Be sure to register your server before July 31, 2020 to keep your' +
          ' mobile notifications flowing.',
        textArguments: [],
        modifiers: [],
        link: 'https://forums.rocket.chat/t/enforcing-registration-requirement-to-utilize-push-gateway/7545',
      },
    },
    __rooms: ['someroom', 'GENERAL'],
  },
  success: true,
};
