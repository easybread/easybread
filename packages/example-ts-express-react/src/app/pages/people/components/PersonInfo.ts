import { Person } from 'schema-dts';

export interface PersonInfo {
  person: Person;
  provider: 'google' | 'bamboo-hr';
}
