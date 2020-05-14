import { BreadServiceAdapter } from '@easybread/core';

import { GoogleContactsAuthStrategy } from './google-contacts.auth-strategy';
import { GOOGLE_PROVIDER_NAME } from './google-contacts.constants';
import { GoogleContactsOperation } from './google-contacts.operation';
import {
  GoogleContactsOauth2CompleteHandler,
  GoogleContactsOauth2StartHandler,
  GoogleContactsPeopleByIdHandler,
  GoogleContactsPeopleCreateHandler,
  GoogleContactsPeopleDeleteHandler,
  GoogleContactsPeopleSearchHandler,
  GoogleContactsPeopleUpdateHandler
} from './handlers';

export class GoogleContactsAdapter extends BreadServiceAdapter<
  GoogleContactsOperation,
  GoogleContactsAuthStrategy
> {
  provider = GOOGLE_PROVIDER_NAME;

  constructor() {
    super();
    this.registerOperationHandlers(
      GoogleContactsOauth2StartHandler,
      GoogleContactsOauth2CompleteHandler,
      GoogleContactsPeopleSearchHandler,
      GoogleContactsPeopleCreateHandler,
      GoogleContactsPeopleUpdateHandler,
      GoogleContactsPeopleDeleteHandler,
      GoogleContactsPeopleByIdHandler
    );
  }
}
