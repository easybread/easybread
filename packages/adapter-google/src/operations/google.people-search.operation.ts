import {
  BreadOperation,
  BreadOperationInputWithParams,
  BreadOperationOutputWithRawDataAndPayload
} from '@easybread/core';
import { PersonSchema } from '@easybread/schemas';

import { GoogleOperationName } from '../google.operation-name';
import { GoogleContactsFeedResponse } from '../interfaces';
import { GooglePeopleSearchOperationInputParams } from './google.people-search.operation.input-params';

export interface GooglePeopleSearchOperation
  extends BreadOperation<GoogleOperationName.PEOPLE_SEARCH> {
  input: BreadOperationInputWithParams<
    GoogleOperationName.PEOPLE_SEARCH,
    GooglePeopleSearchOperationInputParams
  >;
  output: BreadOperationOutputWithRawDataAndPayload<
    GoogleOperationName.PEOPLE_SEARCH,
    GoogleContactsFeedResponse,
    PersonSchema[]
  >;
}
