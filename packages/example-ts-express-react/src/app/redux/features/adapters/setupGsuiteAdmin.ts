import { GsuiteAdminAuthScope } from '@easybread/adapter-gsuite-admin';
import { GoogleCommonOauth2StartOperation } from '@easybread/google-common';

import { ADAPTER_NAME } from '../../../../common';
import { postRequest } from '../../../http';
import { AppThunk } from '../../store';
import { notifyOperationResult } from '../notifications';
import { openGoogleAuthPopup } from './openGoogleAuthPopup';

export const setupGsuiteAdmin = (): AppThunk => async dispatch => {
  const result = await postRequest<
    {},
    GoogleCommonOauth2StartOperation<GsuiteAdminAuthScope>['output']
  >(`/api/adapters/${ADAPTER_NAME.GSUITE_ADMIN}/configurations`, {});

  dispatch(notifyOperationResult(result));

  if (result.rawPayload.success) {
    openGoogleAuthPopup(
      result.rawPayload.data.authUri,
      ADAPTER_NAME.GSUITE_ADMIN,
      dispatch
    );
  }
};
