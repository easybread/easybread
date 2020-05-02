import { GooglePeopleDeleteOperation } from '@easybread/adapter-google';
import { EmployeeDeleteOperation } from '@easybread/operations';

export type PeopleDeleteResponseDto =
  | GooglePeopleDeleteOperation['output']
  | EmployeeDeleteOperation['output'];
