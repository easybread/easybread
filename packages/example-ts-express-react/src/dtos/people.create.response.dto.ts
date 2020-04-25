import { Person } from 'schema-dts';

export interface PeopleCreateResponseDto {
  rawPayload: { success: boolean };
  payload: Person;
  provider: 'google' | 'bamboo-hr';
}
