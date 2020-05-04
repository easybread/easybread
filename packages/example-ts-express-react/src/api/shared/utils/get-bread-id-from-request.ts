import { Request } from 'express';

export const getBreadIdFromRequest = (req: Request): string => {
  return req['user'].id as string;
};
