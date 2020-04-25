import { Person } from 'schema-dts';

export interface PeopleResponseDto {
  payload: Person[];
  provider: 'google' | 'bamboo-hr';
}
