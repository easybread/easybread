import { BreadServiceAdapter } from '../../service-adapter';
import { BambooHrAuthStrategy } from './bamboo-hr.auth-strategy';
import { BAMBOO_HR_PROVIDER } from './bamboo-hr.constants';
import { BambooHrOperation } from './bamboo-hr.operation';
import { EmployeeSearchHandler, SetupBasicAuthHandler } from './handlers';

export class BambooHrAdapter extends BreadServiceAdapter<
  BambooHrOperation,
  BambooHrAuthStrategy
> {
  provider = BAMBOO_HR_PROVIDER;

  constructor() {
    super();
    this.registerOperationHandlers(
      SetupBasicAuthHandler,
      EmployeeSearchHandler
    );
  }
}
