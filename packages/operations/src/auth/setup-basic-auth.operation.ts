import {
  BreadOperation,
  BreadOperationInputWithPayload,
  BreadOperationOutput
} from '@easybread/core';

import { BreadOperationName } from '../bread.operation-name';

export interface SetupBasicAuthInputPayload {
  id?: string;
  secret?: string;
}

export interface SetupBasicAuthOperation<
  T extends object = SetupBasicAuthInputPayload
> extends BreadOperation<BreadOperationName.SETUP_BASIC_AUTH> {
  input: BreadOperationInputWithPayload<BreadOperationName.SETUP_BASIC_AUTH, T>;
  output: BreadOperationOutput<BreadOperationName.SETUP_BASIC_AUTH>;
}
