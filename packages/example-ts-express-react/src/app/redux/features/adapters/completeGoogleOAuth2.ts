import { GoogleCommonOauth2CompleteOperation } from '@easybread/google-common';

import { CompleteGoogleOauth2Dto } from '../../../../api/api.dtos';
import { postRequest } from '../../../http';
import { AppThunk } from '../../store';
import { notifyOperationResult } from '../notifications';

export const completeGoogleOAuth2 = (
  data: CompleteGoogleOauth2Dto
): AppThunk => async dispatch => {
  const result = await postRequest<
    CompleteGoogleOauth2Dto,
    GoogleCommonOauth2CompleteOperation['output']
  >('/api/adapters/google/complete-oauth', data);

  dispatch(notifyOperationResult(result));

  window.close();
};
