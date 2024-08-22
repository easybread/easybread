import { BreadServiceAdapter } from '@easybread/core';
import { AxiosError } from 'axios';
import { uniq } from 'lodash';

import { BambooHrAuthStrategy } from './bamboo-hr.auth-strategy';
import { BAMBOO_HR_PROVIDER_NAME } from './bamboo-hr.constants';
import { BambooHrOperation } from './bamboo-hr.operation';
import {
  BambooEmployeeByIdHandler,
  BambooEmployeeCreateHandler,
  BambooEmployeeSearchHandler,
  BambooEmployeeUpdateHandler,
  BambooSetupBasicAuthHandler,
} from './handlers';

export class BambooHrAdapter extends BreadServiceAdapter<
  BambooHrOperation,
  BambooHrAuthStrategy
> {
  provider = BAMBOO_HR_PROVIDER_NAME;

  constructor() {
    super();
    this.registerOperationHandlers(
      BambooSetupBasicAuthHandler,
      BambooEmployeeSearchHandler,
      BambooEmployeeCreateHandler,
      BambooEmployeeUpdateHandler,
      BambooEmployeeByIdHandler
    );
  }

  protected override createServiceExceptionMessageFromAxiosError(
    error: AxiosError
  ): string {
    // this might be a comma separated list possibly with duplicates
    const bambooErrorMessagesString =
      error.response?.headers['x-bamboohr-error-message'];

    if (!bambooErrorMessagesString) {
      return super.createServiceExceptionMessageFromAxiosError(error);
    }

    // get rid of duplicates and set extended message.
    const message = uniq(bambooErrorMessagesString.split(/,\s?/)).join(', ');

    return `${error.message}. ${message}`;
  }
}
