import { GooglePeopleCreateOperation } from '@easybread/adapter-google-contacts';
import { EmployeeCreateOperation } from '@easybread/operations';

export type PeopleCreateResponseDto =
  | GooglePeopleCreateOperation['output']
  | EmployeeCreateOperation['output'];
