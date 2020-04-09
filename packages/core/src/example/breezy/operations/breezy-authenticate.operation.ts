import {
  BreadOperation,
  BreadOperationInputWithPayload,
  BreadOperationOutputWithRawData
} from '../../../operation';
import { BreezyOperationName } from '../breezy.operation-name';
import {
  BreezyAuthenticatePayload,
  BreezyAuthenticateResponse
} from '../interfaces';

export interface BreezyAuthenticateOperation
  extends BreadOperation<BreezyOperationName.AUTHENTICATE> {
  input: BreadOperationInputWithPayload<
    BreezyOperationName.AUTHENTICATE,
    BreezyAuthenticatePayload
  >;
  output: BreadOperationOutputWithRawData<
    BreezyOperationName.AUTHENTICATE,
    BreezyAuthenticateResponse
  >;
}
