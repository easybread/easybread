import { Person } from 'schema-dts';

export interface PeopleResultsDto {
  payload: Person[];
  provider: 'google' | 'bamboo-hr';
}
