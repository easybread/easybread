import { PersonSchema } from '@easybread/schemas';
import { Request } from 'express';

export type PeopleCreateRequest = Request<
  { adapter: 'google' | 'bamboo' },
  unknown,
  PersonSchema
>;
