import {
  BreadOperation,
  BreadOperationInput,
  BreadOperationOutputWithRawDataAndPayload
} from '@easybread/core';
import { Person } from 'schema-dts';

import { GoogleOperationName } from '../google.operation-name';
import { GoogleContactsFeedResponse } from '../interfaces';

export interface GooglePeopleSearchOperation
  extends BreadOperation<GoogleOperationName.PEOPLE_SEARCH> {
  input: BreadOperationInput<GoogleOperationName.PEOPLE_SEARCH>;
  output: BreadOperationOutputWithRawDataAndPayload<
    GoogleOperationName.PEOPLE_SEARCH,
    GoogleContactsFeedResponse,
    Person[]
  >;
}
