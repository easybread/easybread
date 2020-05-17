import { GoogleCommonOauth2CompleteOperation } from '@easybread/google-common';

import { CompleteGoogleOauth2Dto } from '../../../../api/api.dtos';
import { ADAPTER_NAME } from '../../../../common';
import { postRequest } from '../../../http';
import { AppThunk } from '../../store';
import { notifyOperationResult } from '../notifications';

export const completeGoogleOAuth2 = (
  adapter: 'google-contacts' | 'gsuite-admin',
  data: CompleteGoogleOauth2Dto
): AppThunk => async dispatch => {
  let adapterName: ADAPTER_NAME | 'unknown' = 'unknown';

  if (adapter === 'google-contacts') adapterName = ADAPTER_NAME.GOOGLE_CONTACTS;
  if (adapter === 'gsuite-admin') adapterName = ADAPTER_NAME.GSUITE_ADMIN;

  const result = await postRequest<
    CompleteGoogleOauth2Dto,
    GoogleCommonOauth2CompleteOperation['output']
  >(`/api/adapters/${adapterName}/complete-oauth`, data);

  dispatch(notifyOperationResult(result));

  window.close();
};
