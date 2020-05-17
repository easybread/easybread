import { GoogleContactsPeopleDeleteOperation } from '@easybread/adapter-google-contacts';
import { GsuiteAdminUsersDeleteOperation } from '@easybread/adapter-gsuite-admin';
import { EmployeeDeleteOperation } from '@easybread/operations';

export type PeopleDeleteResponseDto =
  | GoogleContactsPeopleDeleteOperation['output']
  | GsuiteAdminUsersDeleteOperation['output']
  | EmployeeDeleteOperation['output'];
