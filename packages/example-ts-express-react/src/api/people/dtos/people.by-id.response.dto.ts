import { BambooEmployee } from '@easybread/adapter-bamboo-hr';
import { GoogleContactsPeopleByIdOperation } from '@easybread/adapter-google-contacts';
import { GsuiteAdminUsersByIdOperation } from '@easybread/adapter-gsuite-admin';
import { EmployeeByIdOperation } from '@easybread/operations';

export type PeopleByIdResponseDto =
  | GoogleContactsPeopleByIdOperation['output']
  | GsuiteAdminUsersByIdOperation['output']
  | EmployeeByIdOperation<BambooEmployee>['output'];
