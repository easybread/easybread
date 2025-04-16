import {
  GoogleCommonAuthOauth2CompleteHandler,
  GoogleCommonAuthOauth2StartHandler,
} from '@easybread/adapter-google-common';
import { ServiceAdapter } from '@easybread/core';

import { GoogleContactsAuthStrategy } from './google-contacts.auth-strategy';
import { GOOGLE_CONTACTS_PROVIDER_NAME } from './google-contacts.constants';
import {
  GoogleContactsUserByIdHandler,
  GoogleContactsUserCreateHandler,
  GoogleContactsUserDeleteHandler,
  GoogleContactsUserSearchHandler,
  GoogleContactsUserUpdateHandler,
} from './handlers';

const HANDLER_MAP = {
  [GoogleContactsUserSearchHandler.name]: GoogleContactsUserSearchHandler,
  [GoogleContactsUserCreateHandler.name]: GoogleContactsUserCreateHandler,
  [GoogleContactsUserUpdateHandler.name]: GoogleContactsUserUpdateHandler,
  [GoogleContactsUserDeleteHandler.name]: GoogleContactsUserDeleteHandler,
  [GoogleContactsUserByIdHandler.name]: GoogleContactsUserByIdHandler,
  [GoogleCommonAuthOauth2StartHandler.name]: GoogleCommonAuthOauth2StartHandler,
  [GoogleCommonAuthOauth2CompleteHandler.name]:
    GoogleCommonAuthOauth2CompleteHandler,
} as const;

export class GoogleContactsAdapter extends ServiceAdapter<
  typeof HANDLER_MAP,
  GoogleContactsAuthStrategy
> {
  provider = GOOGLE_CONTACTS_PROVIDER_NAME;

  constructor(auth: GoogleContactsAuthStrategy) {
    super(HANDLER_MAP, auth, null);
  }
}
