import { combineReducers } from '@reduxjs/toolkit';

import { adaptersReducer } from './features/adapters';
import { peopleReducer } from './features/people';

const rootReducer = combineReducers({
  adapters: adaptersReducer,
  people: peopleReducer
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
