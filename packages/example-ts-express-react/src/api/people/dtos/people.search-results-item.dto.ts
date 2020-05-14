import { BambooEmployeesDirectory } from '@easybread/adapter-bamboo-hr';
import { GoogleContactsPeopleSearchOperation } from '@easybread/adapter-google-contacts';
import { EmployeeSearchOperation } from '@easybread/operations';

export type PeopleSearchResultsItemDto =
  | EmployeeSearchOperation<BambooEmployeesDirectory>['output']
  | GoogleContactsPeopleSearchOperation['output'];
