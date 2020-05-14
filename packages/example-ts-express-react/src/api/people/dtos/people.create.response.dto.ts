import { GoogleContactsPeopleCreateOperation } from '@easybread/adapter-google-contacts';
import { EmployeeCreateOperation } from '@easybread/operations';

export type PeopleCreateResponseDto =
  | GoogleContactsPeopleCreateOperation['output']
  | EmployeeCreateOperation['output'];
