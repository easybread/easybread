import { PersonSchema } from '@easybread/schemas';
import { Request } from 'express';

export type PeopleUpdateRequest = Request<
  { adapter: 'google' | 'bamboo'; id: string },
  unknown,
  PersonSchema
>;
