import { ADAPTER_NAME } from '../../../../common';
import { AppDispatch } from '../../store';
import { adaptersActions } from './adaptersSlice';

export const openGoogleAuthPopup = (
  url: string,
  adapter: ADAPTER_NAME,
  dispatch: AppDispatch
): void => {
  const popup = window.open(
    url,
    '_blank',
    `toolbar=no, location=no, directories=no, status=no, menubar=no, 
        scrollbars=no, resizable=no, copyhistory=no, width=500, 
        height=620, top=100, left=100`
  );

  const id = setInterval(() => {
    if (!popup || popup.closed || popup.closed === undefined) {
      clearInterval(id);
      dispatch(
        adaptersActions.setAdapterConfigured({ adapter, configured: true })
      );
    }
  }, 500);
};
