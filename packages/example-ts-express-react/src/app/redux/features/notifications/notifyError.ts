import { AppThunk } from '../../store';
import { dispatchErrorHelper } from './helpers';

export function notifyError(title: string, message?: string): AppThunk {
  return dispatch => {
    dispatchErrorHelper(dispatch, title, message);
  };
}
