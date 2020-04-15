import { GoogleOauth2CompleteOperation } from '@easybread/adapter-google';

import { CompleteGoogleOauth2Dto } from '../../../../dtos';
import { postRequest } from '../../../http';
import { AppThunk } from '../../store';

export const completeGoogleOAuth2 = (
  data: CompleteGoogleOauth2Dto
): AppThunk => async _ => {
  await postRequest<
    CompleteGoogleOauth2Dto,
    GoogleOauth2CompleteOperation['output']
  >('/api/adapters/google/complete-oauth', data);

  window.close();
};
