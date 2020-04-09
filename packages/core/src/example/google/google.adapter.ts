import { BreadServiceAdapter } from '../../service-adapter';
import { GoogleAuthStrategy } from './google.auth-strategy';
import { GOOGLE_PROVIDER } from './google.constants';
import { GoogleOperation } from './google.operation';
import {
  GoogleOauth2CompleteHandler,
  GoogleOauth2StartHandler,
  GooglePeopleSearchHandler
} from './handlers';

export class GoogleAdapter extends BreadServiceAdapter<
  GoogleOperation,
  GoogleAuthStrategy
> {
  provider = GOOGLE_PROVIDER;

  constructor() {
    super();
    this.registerOperationHandlers(
      GoogleOauth2StartHandler,
      GoogleOauth2CompleteHandler,
      GooglePeopleSearchHandler
    );
  }
}
