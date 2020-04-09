import { BreadOperationHandler } from '../../../operation';
import { BreezyAuthStrategy } from '../breezy.auth-strategy';
import { BreezyOperationName } from '../breezy.operation-name';
import { BreezyAuthenticateOperation } from '../operations';

export const BreezyAuthenticateHandler: BreadOperationHandler<
  BreezyAuthenticateOperation,
  BreezyAuthStrategy
> = {
  name: BreezyOperationName.AUTHENTICATE,

  async handle(input, context) {
    const { breadId, payload } = input;

    const result = await context.auth.authenticate(breadId, payload);

    return {
      name: BreezyOperationName.AUTHENTICATE,
      rawPayload: { success: true, data: result }
    };
  }
};
