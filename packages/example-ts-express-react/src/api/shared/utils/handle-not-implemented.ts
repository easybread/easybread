import { NotImplementedException } from '@easybread/core';
import { Response } from 'express';

export const handleNotImplemented = (res: Response): void => {
  res.status(501);
  res.json(new NotImplementedException());
};
