import { BambooEmployeesDirectory } from '@easybread/adapter-bamboo-hr';
import { GooglePeopleSearchOperation } from '@easybread/adapter-google';
import { EmployeeSearchOperation } from '@easybread/operations';

export type PeopleResponseDto = (
  | EmployeeSearchOperation<BambooEmployeesDirectory>
  | GooglePeopleSearchOperation
)['output'];
