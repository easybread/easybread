import { GoogleCommonOauth2StartOperation } from '@easybread/google-common';

import { GoogleContactsAuthScopes } from '../interfaces';

export type GoogleOauth2StartOperation = GoogleCommonOauth2StartOperation<
  GoogleContactsAuthScopes
>;
