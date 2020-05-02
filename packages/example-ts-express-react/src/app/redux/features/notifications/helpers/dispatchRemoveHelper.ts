import { AppDispatch } from '../../../store';
import { AppNotification, notificationsActions } from '../notificationsSlice';

export function dispatchRemoveHelper(
  dispatch: AppDispatch,
  notification: AppNotification
): void {
  dispatch(notificationsActions.removeNotification(notification));
}
