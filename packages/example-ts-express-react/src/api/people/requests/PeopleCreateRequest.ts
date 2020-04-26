import { Request } from 'express';
import { Person } from 'schema-dts';

export type PeopleCreateRequest = Request<
  { adapter: 'google' | 'bamboo' },
  unknown,
  Person
>;
