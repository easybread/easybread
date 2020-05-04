import { Request } from 'express';

export type PeopleSearchRequest = Request<
  {},
  unknown,
  unknown,
  { query: string }
>;
