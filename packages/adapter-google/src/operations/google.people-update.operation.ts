import {
  BreadOperation,
  BreadOperationInputWithPayload,
  BreadOperationOutputWithRawDataAndPayload
} from '@easybread/core';
import { Person } from 'schema-dts';

import { GoogleOperationName } from '../google.operation-name';
import { GoogleContactsFeedEntryCreateResponse } from '../interfaces';

export interface GooglePeopleUpdateOperation
  extends BreadOperation<GoogleOperationName.PEOPLE_UPDATE> {
  input: BreadOperationInputWithPayload<
    GoogleOperationName.PEOPLE_UPDATE,
    Person
  >;
  output: BreadOperationOutputWithRawDataAndPayload<
    GoogleOperationName.PEOPLE_UPDATE,
    GoogleContactsFeedEntryCreateResponse,
    Person
  >;
}
