import { AppDispatch } from '../../../store';
import { NotificationType } from '../notificationsSlice';
import { dispatchNotificationHelper } from './dispatchNotificationHelper';

export function dispatchErrorHelper(
  dispatch: AppDispatch,
  title: string,
  message?: string
): void {
  dispatchNotificationHelper(dispatch, NotificationType.ERROR, title, message);
}
