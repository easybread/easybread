import { HttpTransport, ServiceAdapter } from '@easybread/core';

import { BambooHrAuthStrategy } from './bamboo-hr.auth-strategy';
import { BAMBOO_HR_PROVIDER_NAME } from './bamboo-hr.constants';
import {
  BambooAuthBasicSetHandler,
  BambooAuthOidcCompleteHandler,
  BambooAuthOidcStartHandler,
  BambooEmployeeByIdHandler,
  BambooEmployeeCreateHandler,
  BambooEmployeeSearchHandler,
  BambooJobApplicantSearchHandler,
  BambooJobApplicationSearchHandler,
} from './handlers';
import { BambooEmployeeUpdateHandler } from './handlers/bamboo.employee-update.handler';

const HANDLER_MAP = {
  [BambooAuthOidcStartHandler.name]: BambooAuthOidcStartHandler,
  [BambooAuthBasicSetHandler.name]: BambooAuthBasicSetHandler,
  [BambooAuthOidcCompleteHandler.name]: BambooAuthOidcCompleteHandler,
  [BambooEmployeeSearchHandler.name]: BambooEmployeeSearchHandler,
  [BambooEmployeeByIdHandler.name]: BambooEmployeeByIdHandler,
  [BambooEmployeeCreateHandler.name]: BambooEmployeeCreateHandler,
  [BambooJobApplicationSearchHandler.name]: BambooJobApplicationSearchHandler,
  [BambooJobApplicantSearchHandler.name]: BambooJobApplicantSearchHandler,
  [BambooEmployeeUpdateHandler.name]: BambooEmployeeUpdateHandler,
} as const;

export class BambooHrAdapter extends ServiceAdapter<
  typeof HANDLER_MAP,
  BambooHrAuthStrategy
> {
  readonly provider = BAMBOO_HR_PROVIDER_NAME;

  constructor(auth: BambooHrAuthStrategy) {
    super(HANDLER_MAP, auth, null);
  }

  override transformError(error: unknown) {
    if (!HttpTransport.isHttpError(error)) return super.transformError(error);

    // this might be a comma separated list possibly with duplicates
    const bambooErrorMessagesString =
      error.response?.headers['x-bamboohr-error-message'];

    if (!bambooErrorMessagesString) {
      return super.transformError(error);
    }

    // get rid of duplicates and set extended message.
    const message = Array.from(
      new Set(bambooErrorMessagesString.split(/,\s?/)),
    ).join(', ');

    return super.transformError(`${error.message}. ${message}`);
  }
}
