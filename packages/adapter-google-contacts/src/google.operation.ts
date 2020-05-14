import { GoogleCommonOauth2CompleteOperation } from '@easybread/google-common';

import {
  GoogleOauth2StartOperation,
  GooglePeopleByIdOperation,
  GooglePeopleCreateOperation,
  GooglePeopleDeleteOperation,
  GooglePeopleSearchOperation,
  GooglePeopleUpdateOperation
} from './operations';

export type GoogleOperation =
  | GoogleOauth2StartOperation
  | GoogleCommonOauth2CompleteOperation
  | GooglePeopleByIdOperation
  | GooglePeopleSearchOperation
  | GooglePeopleCreateOperation
  | GooglePeopleUpdateOperation
  | GooglePeopleDeleteOperation;
