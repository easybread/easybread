import { RocketChatUsersList } from '../interfaces';

export const USERS_LIST_MOCK: RocketChatUsersList = {
  users: [
    {
      _id: 'id1',
      type: 'user',
      status: 'online',
      active: true,
      name: 'User One',
      utcOffset: 3,
      username: 'user.one',
      language: 'en',
      statusText: '',
      __rooms: ['roomone', 'GENERAL', 'roomtwo']
    },
    {
      _id: 'id2',
      username: 'app.giphy',
      type: 'app',
      active: true,
      name: 'GIPHY',
      status: 'online',
      appId: 'app2',
      __rooms: []
    },
    {
      _id: 'id3',
      type: 'user',
      status: 'offline',
      active: true,
      name: 'User Two',
      utcOffset: -4,
      username: 'user.two',
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
          link:
            'https://forums.rocket.chat/t/enforcing-registration-requirement-to-utilize-push-gateway/7545'
        }
      },
      __rooms: ['roomthree', 'GENERAL']
    }
  ],
  count: 3,
  offset: 0,
  total: 3,
  success: true
};
