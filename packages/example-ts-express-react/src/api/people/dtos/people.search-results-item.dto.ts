import { BambooEmployeesDirectory } from '@easybread/adapter-bamboo-hr';
import { GooglePeopleSearchOperation } from '@easybread/adapter-google-contacts';
import { EmployeeSearchOperation } from '@easybread/operations';

export type PeopleSearchResultsItemDto =
  | EmployeeSearchOperation<BambooEmployeesDirectory>['output']
  | GooglePeopleSearchOperation['output'];
