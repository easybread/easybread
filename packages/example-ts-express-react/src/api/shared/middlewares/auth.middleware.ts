import { NextFunction, Request, Response } from 'express';

export const authMiddleware = (
  req: Request,
  _: Response,
  next: NextFunction
): void => {
  // here could have been JWT token verification
  req['user'] = { id: '1' };
  next();
};
