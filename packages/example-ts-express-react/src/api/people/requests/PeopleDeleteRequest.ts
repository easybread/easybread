import { Request } from 'express';

export type PeopleDeleteRequest = Request<
  { adapter: 'google' | 'bamboo'; id: string },
  { id: string }
>;
