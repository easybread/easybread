import { GoogleContactsPeopleDeleteOperation } from '@easybread/adapter-google-contacts';
import { EmployeeDeleteOperation } from '@easybread/operations';

export type PeopleDeleteResponseDto =
  | GoogleContactsPeopleDeleteOperation['output']
  | EmployeeDeleteOperation['output'];
