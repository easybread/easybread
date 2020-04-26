import { Request } from 'express';
import { Person } from 'schema-dts';

export type PeopleUpdateRequest = Request<
  { adapter: 'google' | 'bamboo'; id: string },
  unknown,
  Person
>;
