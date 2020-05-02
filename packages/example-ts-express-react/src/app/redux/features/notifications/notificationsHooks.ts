import { useSelector } from 'react-redux';

import { RootState } from '../../rootReducer';
import { AppNotification } from './notificationsSlice';

export function useNotificationsArray(): AppNotification[] {
  return useSelector<RootState, AppNotification[]>(state => {
    return state.notifications.data;
  });
}
