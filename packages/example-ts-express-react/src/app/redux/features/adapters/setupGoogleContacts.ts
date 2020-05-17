import { GoogleContactsAuthScopes } from '@easybread/adapter-google-contacts';
import { GoogleCommonOauth2StartOperation } from '@easybread/google-common';

import { ADAPTER_NAME } from '../../../../common';
import { postRequest } from '../../../http';
import { AppThunk } from '../../store';
import { notifyOperationResult } from '../notifications';
import { openGoogleAuthPopup } from './openGoogleAuthPopup';

export const setupGoogleContacts = (): AppThunk => async dispatch => {
  const result = await postRequest<
    {},
    GoogleCommonOauth2StartOperation<GoogleContactsAuthScopes>['output']
  >(`/api/adapters/${ADAPTER_NAME.GOOGLE_CONTACTS}/configurations`, {});

  dispatch(notifyOperationResult(result));

  if (result.rawPayload.success) {
    openGoogleAuthPopup(
      result.rawPayload.data.authUri,
      ADAPTER_NAME.GOOGLE_CONTACTS,
      dispatch
    );
  }
};
