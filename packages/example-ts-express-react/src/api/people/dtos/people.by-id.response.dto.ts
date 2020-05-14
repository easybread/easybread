import { BambooEmployee } from '@easybread/adapter-bamboo-hr';
import { GoogleContactsPeopleByIdOperation } from '@easybread/adapter-google-contacts';
import { EmployeeByIdOperation } from '@easybread/operations';

export type PeopleByIdResponseDto =
  | GoogleContactsPeopleByIdOperation['output']
  | EmployeeByIdOperation<BambooEmployee>['output'];
