import {
  BreadOperation,
  BreadOperationInputWithPayload,
  BreadOperationOutputWithPayload
} from '@easybread/core';
import { Person } from 'schema-dts';

import { GoogleOperationName } from '../google.operation-name';

export interface GooglePeopleDeleteOperation
  extends BreadOperation<GoogleOperationName.PEOPLE_DELETE> {
  input: BreadOperationInputWithPayload<
    GoogleOperationName.PEOPLE_DELETE,
    Person
  >;
  output: BreadOperationOutputWithPayload<
    GoogleOperationName.PEOPLE_DELETE,
    Person
  >;
}
