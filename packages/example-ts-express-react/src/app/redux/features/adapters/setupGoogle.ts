import { GoogleOauth2StartOperation } from '@easybread/adapter-google';

import { postRequest } from '../../../http';
import { AppThunk } from '../../store';
import { notifyOperationResult } from '../notifications';
import { adaptersActions } from './adaptersSlice';

export const setupGoogle = (): AppThunk => async dispatch => {
  const openPopup = (url: string): void => {
    const popup = window.open(
      url,
      '_blank',
      `toolbar=no, location=no, directories=no, status=no, menubar=no, 
        scrollbars=no, resizable=no, copyhistory=no, width=500, 
        height=620, top=100, left=100`
    );

    const id = setInterval(() => {
      // eslint-disable-next-line no-console
      if (!popup || popup.closed || popup.closed === undefined) {
        clearInterval(id);
        dispatch(
          adaptersActions.setAdapterConfigured({
            adapter: 'google',
            configured: true
          })
        );
      }
    }, 500);
  };

  const result = await postRequest<{}, GoogleOauth2StartOperation['output']>(
    '/api/adapters/google/configurations',
    {}
  );

  dispatch(notifyOperationResult(result));

  if (result.rawPayload.success) {
    openPopup(result.rawPayload.data.authUri);
  }
};
