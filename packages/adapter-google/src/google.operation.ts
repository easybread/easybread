import {
  GoogleOauth2CompleteOperation,
  GoogleOauth2StartOperation,
  GooglePeopleByIdOperation,
  GooglePeopleCreateOperation,
  GooglePeopleDeleteOperation,
  GooglePeopleSearchOperation,
  GooglePeopleUpdateOperation
} from './operations';

export type GoogleOperation =
  | GoogleOauth2StartOperation
  | GoogleOauth2CompleteOperation
  | GooglePeopleByIdOperation
  | GooglePeopleSearchOperation
  | GooglePeopleCreateOperation
  | GooglePeopleUpdateOperation
  | GooglePeopleDeleteOperation;
