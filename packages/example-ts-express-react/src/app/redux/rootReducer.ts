import { combineReducers } from '@reduxjs/toolkit';

import { adaptersReducer } from './features/adapters';
import { notificationsReducer } from './features/notifications';
import { peopleReducer } from './features/people';

const rootReducer = combineReducers({
  adapters: adaptersReducer,
  people: peopleReducer,
  notifications: notificationsReducer
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
