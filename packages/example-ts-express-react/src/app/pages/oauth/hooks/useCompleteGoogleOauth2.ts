import { GoogleOauth2CompleteOperation } from '@easybread/adapter-google';

import { CompleteGoogleOauth2Dto } from '../../../../dtos';
import { usePost } from '../../../hooks/http';
import { UsePostReturn } from '../../../hooks/http/interfaces';

export function useCompleteGoogleOauth2(): UsePostReturn<
  CompleteGoogleOauth2Dto,
  GoogleOauth2CompleteOperation['output']
> {
  const closeWindow = (): void => {
    window.close();
  };
  return usePost<
    CompleteGoogleOauth2Dto,
    GoogleOauth2CompleteOperation['output']
  >('/api/adapters/google/complete-oauth', closeWindow);
}
