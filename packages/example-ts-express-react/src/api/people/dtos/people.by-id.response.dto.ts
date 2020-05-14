import { BambooEmployee } from '@easybread/adapter-bamboo-hr';
import { GooglePeopleByIdOperation } from '@easybread/adapter-google-contacts';
import { EmployeeByIdOperation } from '@easybread/operations';

export type PeopleByIdResponseDto =
  | GooglePeopleByIdOperation['output']
  | EmployeeByIdOperation<BambooEmployee>['output'];
