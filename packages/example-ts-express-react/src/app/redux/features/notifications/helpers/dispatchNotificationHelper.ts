import { AppDispatch } from '../../../store';
import {
  AppNotification,
  notificationsActions,
  NotificationType
} from '../notificationsSlice';
import { dispatchCleanExtraHelper } from './dispatchCleanExtraHelper';
import { dispatchRemoveHelper } from './dispatchRemoveHelper';

export function dispatchNotificationHelper(
  dispatch: AppDispatch,
  type: NotificationType,
  title: string,
  message?: string
): void {
  const noty: AppNotification = {
    type,
    title,
    message,
    date: Date.now()
  };

  dispatch(notificationsActions.addNotification(noty));

  setTimeout(() => dispatchCleanExtraHelper(dispatch), 500);
  setTimeout(() => dispatchRemoveHelper(dispatch, noty), 15000);
}
