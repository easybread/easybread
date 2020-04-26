import { GooglePeopleCreateOperation } from '@easybread/adapter-google';
import { EmployeeCreateOperation } from '@easybread/operations';

export type PeopleCreateResponseDto = (
  | GooglePeopleCreateOperation
  | EmployeeCreateOperation
)['output'];
