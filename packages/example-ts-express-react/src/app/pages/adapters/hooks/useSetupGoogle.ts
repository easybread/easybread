import { GoogleOauth2StartOperation } from '@easybread/adapter-google';
import { useCallback } from 'react';

import { SetupGoogleDto } from '../../../../dtos';
import { usePost } from '../../../hooks/http';
import {
  HttpDoneCallback,
  UsePostReturn
} from '../../../hooks/http/interfaces';

export function useSetupGoogle(
  callback: HttpDoneCallback<GoogleOauth2StartOperation['output']>
): UsePostReturn<SetupGoogleDto, GoogleOauth2StartOperation['output']> {
  const internalCallback: HttpDoneCallback<
    GoogleOauth2StartOperation['output']
  > = useCallback(
    (data) => {
      if (!data?.rawPayload.success) return;

      const popup = window.open(
        data.rawPayload.data.authUri,
        '_blank',
        `toolbar=no, location=no, directories=no, status=no, menubar=no, 
        scrollbars=no, resizable=no, copyhistory=no, width=500, 
        height=620, top=100, left=100`
      );

      const id = setInterval(() => {
        // eslint-disable-next-line no-console
        if (!popup || popup.closed || popup.closed === undefined) {
          callback(data);
          clearInterval(id);
        }
      }, 500);
    },
    [callback]
  );

  return usePost<SetupGoogleDto, GoogleOauth2StartOperation['output']>(
    '/api/adapters/google/configurations',
    internalCallback
  );
}
