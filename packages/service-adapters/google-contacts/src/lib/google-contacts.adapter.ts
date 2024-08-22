import { BreadServiceAdapter } from '@easybread/core';
import {
  GoogleCommonOauth2CompleteHandler,
  GoogleCommonOauth2StartHandler
} from '@easybread/google-common';

import { GoogleContactsAuthStrategy } from './google-contacts.auth-strategy';
import { GOOGLE_PROVIDER_NAME } from './google-contacts.constants';
import { GoogleContactsOperation } from './google-contacts.operation';
import {
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
      GoogleCommonOauth2StartHandler,
      GoogleCommonOauth2CompleteHandler,
      GoogleContactsPeopleSearchHandler,
      GoogleContactsPeopleCreateHandler,
      GoogleContactsPeopleUpdateHandler,
      GoogleContactsPeopleDeleteHandler,
      GoogleContactsPeopleByIdHandler
    );
  }
}
