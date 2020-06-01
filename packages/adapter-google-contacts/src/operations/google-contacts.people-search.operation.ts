import {
  BreadCollectionOperation,
  BreadCollectionOperationInputWithParams,
  BreadCollectionOperationOutputWithRawDataAndPayload
} from '@easybread/core';
import { PersonSchema } from '@easybread/schemas';

import { GoogleContactsOperationName } from '../google-contacts.operation-name';
import { GoogleContactsFeedResponse } from '../interfaces';
import { GoogleContactsPeopleSearchOperationInputParams } from './google-contacts.people-search.operation.input-params';

export interface GoogleContactsPeopleSearchOperation
  extends BreadCollectionOperation<GoogleContactsOperationName.PEOPLE_SEARCH> {
  input: BreadCollectionOperationInputWithParams<
    GoogleContactsOperationName.PEOPLE_SEARCH,
    GoogleContactsPeopleSearchOperationInputParams
  >;
  output: BreadCollectionOperationOutputWithRawDataAndPayload<
    GoogleContactsOperationName.PEOPLE_SEARCH,
    GoogleContactsFeedResponse,
    PersonSchema[]
  >;
}
