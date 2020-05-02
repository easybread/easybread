import { AppDispatch } from '../../../store';
import { NotificationType } from '../notificationsSlice';
import { dispatchNotificationHelper } from './dispatchNotificationHelper';

export function dispatchSuccessHelper(
  dispatch: AppDispatch,
  title: string,
  message?: string
): void {
  dispatchNotificationHelper(
    dispatch,
    NotificationType.SUCCESS,
    title,
    message
  );
}
