import { AppDispatch } from '../../../store';
import { notificationsActions } from '../notificationsSlice';

export function dispatchCleanExtraHelper(dispatch: AppDispatch): void {
  dispatch(notificationsActions.cleanExtraNotifications());
}
