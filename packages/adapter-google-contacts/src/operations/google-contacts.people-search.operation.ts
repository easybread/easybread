import {
  BreadOperation,
  BreadOperationInputWithParams,
  BreadOperationOutputWithRawDataAndPayload
} from '@easybread/core';
import { PersonSchema } from '@easybread/schemas';

import { GoogleContactsOperationName } from '../google-contacts.operation-name';
import { GoogleContactsFeedResponse } from '../interfaces';
import { GoogleContactsPeopleSearchOperationInputParams } from './google-contacts.people-search.operation.input-params';

export interface GoogleContactsPeopleSearchOperation
  extends BreadOperation<GoogleContactsOperationName.PEOPLE_SEARCH> {
  input: BreadOperationInputWithParams<
    GoogleContactsOperationName.PEOPLE_SEARCH,
    GoogleContactsPeopleSearchOperationInputParams
  >;
  output: BreadOperationOutputWithRawDataAndPayload<
    GoogleContactsOperationName.PEOPLE_SEARCH,
    GoogleContactsFeedResponse,
    PersonSchema[]
  >;
}
