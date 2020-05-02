import { GoogleOauth2CompleteOperation } from '@easybread/adapter-google';

import { CompleteGoogleOauth2Dto } from '../../../../api/api.dtos';
import { postRequest } from '../../../http';
import { AppThunk } from '../../store';
import { notifyOperationResult } from '../notifications';

export const completeGoogleOAuth2 = (
  data: CompleteGoogleOauth2Dto
): AppThunk => async dispatch => {
  const result = await postRequest<
    CompleteGoogleOauth2Dto,
    GoogleOauth2CompleteOperation['output']
  >('/api/adapters/google/complete-oauth', data);

  dispatch(notifyOperationResult(result));

  window.close();
};
