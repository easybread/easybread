import { GooglePeopleDeleteOperation } from '@easybread/adapter-google-contacts';
import { EmployeeDeleteOperation } from '@easybread/operations';

export type PeopleDeleteResponseDto =
  | GooglePeopleDeleteOperation['output']
  | EmployeeDeleteOperation['output'];
