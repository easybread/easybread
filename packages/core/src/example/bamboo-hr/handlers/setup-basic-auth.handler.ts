import { BreadOperationHandler, BreadOperationName } from '../../../operation';
import { SetupBasicAuthOperation } from '../../../operations';
import { BambooHrAuthStrategy } from '../bamboo-hr.auth-strategy';
import { BambooBasicAuthPayload } from '../interfaces';

export const SetupBasicAuthHandler: BreadOperationHandler<
  SetupBasicAuthOperation<BambooBasicAuthPayload>,
  BambooHrAuthStrategy
> = {
  name: BreadOperationName.SETUP_BASIC_AUTH,

  async handle(input, context) {
    await context.auth.authenticate(input.breadId, input.payload);

    return {
      name: BreadOperationName.SETUP_BASIC_AUTH,
      rawPayload: { success: true }
    };
  }
};
