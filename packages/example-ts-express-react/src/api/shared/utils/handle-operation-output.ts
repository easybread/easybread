import { BreadOperation } from '@easybread/core';
import { Response } from 'express';

export const handleOperationOutput = (
  res: Response,
  output: BreadOperation<string>['output']
): void => {
  if (!output.rawPayload.success) {
    res.status(500);
    res.json(output);
    return;
  }

  res.json(output);
};
