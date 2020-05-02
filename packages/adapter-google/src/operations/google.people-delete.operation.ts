import {
  BreadOperation,
  BreadOperationInputWithPayload,
  BreadOperationOutputWithPayload
} from '@easybread/core';
import { PersonSchema } from '@easybread/schemas';

import { GoogleOperationName } from '../google.operation-name';

export interface GooglePeopleDeleteOperation
  extends BreadOperation<GoogleOperationName.PEOPLE_DELETE> {
  input: BreadOperationInputWithPayload<
    GoogleOperationName.PEOPLE_DELETE,
    PersonSchema
  >;
  output: BreadOperationOutputWithPayload<
    GoogleOperationName.PEOPLE_DELETE,
    PersonSchema
  >;
}
