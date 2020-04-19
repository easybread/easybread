import {
  BreadOperation,
  BreadOperationInputWithPayload,
  BreadOperationOutputWithRawDataAndPayload
} from '@easybread/core';
import { Person } from 'schema-dts';

import { GoogleOperationName } from '../google.operation-name';
import { GoogleContactsFeedEntryCreateResponse } from '../interfaces';

export interface GooglePeopleCreateOperation
  extends BreadOperation<GoogleOperationName.PEOPLE_CREATE> {
  input: BreadOperationInputWithPayload<
    GoogleOperationName.PEOPLE_CREATE,
    Person
  >;
  output: BreadOperationOutputWithRawDataAndPayload<
    GoogleOperationName.PEOPLE_CREATE,
    GoogleContactsFeedEntryCreateResponse,
    Person
  >;
}
