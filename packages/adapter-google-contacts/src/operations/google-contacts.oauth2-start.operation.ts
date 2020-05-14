import { GoogleCommonOauth2StartOperation } from '@easybread/google-common';

import { GoogleContactsAuthScopes } from '../interfaces';

export type GoogleContactsOauth2StartOperation = GoogleCommonOauth2StartOperation<
  GoogleContactsAuthScopes
>;
