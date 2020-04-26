import { AppThunk } from '../../store';
import { dispatchSuccessHelper } from './helpers';

export function notifySuccess(title: string, message?: string): AppThunk {
  return dispatch => {
    dispatchSuccessHelper(dispatch, title, message);
  };
}
