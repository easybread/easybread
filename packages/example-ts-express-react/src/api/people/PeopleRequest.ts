import { Request } from 'express';

export type PeopleRequest = Request<{ adapter: 'google' | 'bamboo' }>;
