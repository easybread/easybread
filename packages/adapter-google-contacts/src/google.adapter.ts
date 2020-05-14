import { BreadServiceAdapter } from '@easybread/core';

import { GoogleAuthStrategy } from './google.auth-strategy';
import { GOOGLE_PROVIDER_NAME } from './google.constants';
import { GoogleOperation } from './google.operation';
import {
  GoogleOauth2CompleteHandler,
  GoogleOauth2StartHandler,
  GooglePeopleByIdHandler,
  GooglePeopleCreateHandler,
  GooglePeopleDeleteHandler,
  GooglePeopleSearchHandler,
  GooglePeopleUpdateHandler
} from './handlers';

export class GoogleAdapter extends BreadServiceAdapter<
  GoogleOperation,
  GoogleAuthStrategy
> {
  provider = GOOGLE_PROVIDER_NAME;

  constructor() {
    super();
    this.registerOperationHandlers(
      GoogleOauth2StartHandler,
      GoogleOauth2CompleteHandler,
      GooglePeopleSearchHandler,
      GooglePeopleCreateHandler,
      GooglePeopleUpdateHandler,
      GooglePeopleDeleteHandler,
      GooglePeopleByIdHandler
    );
  }
}
