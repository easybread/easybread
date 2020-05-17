import { GoogleContactsPeopleCreateOperation } from '@easybread/adapter-google-contacts';
import { GsuiteAdminUsersCreateOperation } from '@easybread/adapter-gsuite-admin';
import { EmployeeCreateOperation } from '@easybread/operations';

export type PeopleCreateResponseDto =
  | GoogleContactsPeopleCreateOperation['output']
  | GsuiteAdminUsersCreateOperation['output']
  | EmployeeCreateOperation['output'];
