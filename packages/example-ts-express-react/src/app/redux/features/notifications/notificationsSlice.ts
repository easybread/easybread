import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { remove } from 'lodash';

export enum NotificationType {
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS'
}

export interface AppNotification {
  type: NotificationType;
  title: string;
  message?: string;
  date: number;
}

interface NotificationsDataState {
  // THINKING...
  data: AppNotification[];
}

interface NotificationsArchiveState {
  // THINKING...
  archive: AppNotification[];
}

export type NotificationsState = NotificationsDataState &
  NotificationsArchiveState;

const initialState: NotificationsState = {
  data: [],
  archive: []
};

const MAX_NOTIFICATIONS_NUMBER = 4;

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    cleanExtraNotifications(state) {
      state.data = state.data.splice(0, MAX_NOTIFICATIONS_NUMBER);
    },

    addNotification(state, action: PayloadAction<AppNotification>) {
      state.data.unshift(action.payload);
    },

    removeNotification(state, action: PayloadAction<AppNotification>) {
      remove(state.data, action.payload);
    }
  }
});

export const {
  reducer: notificationsReducer,
  actions: notificationsActions
} = notificationsSlice;
