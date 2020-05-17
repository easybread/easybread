import { BambooEmployeesDirectory } from '@easybread/adapter-bamboo-hr';
import { GoogleContactsPeopleSearchOperation } from '@easybread/adapter-google-contacts';
import { GsuiteAdminUsersSearchOperation } from '@easybread/adapter-gsuite-admin';
import { EmployeeSearchOperation } from '@easybread/operations';

export type PeopleSearchResultsItemDto =
  | EmployeeSearchOperation<BambooEmployeesDirectory>['output']
  | GoogleContactsPeopleSearchOperation['output']
  | GsuiteAdminUsersSearchOperation['output'];
