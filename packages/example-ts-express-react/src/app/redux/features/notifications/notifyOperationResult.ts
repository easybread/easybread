import {
  BreadException,
  BreadOperation,
  ServiceException
} from '@easybread/core';
import { isObject } from 'lodash';

import { AppThunk } from '../../store';
import { dispatchErrorHelper, dispatchSuccessHelper } from './helpers';

export function notifyOperationResult<
  TOperation extends BreadOperation<string>
>(output: TOperation['output']): AppThunk {
  return dispatch => {
    const { name, provider, rawPayload } = output;

    if (rawPayload.success) {
      dispatchSuccessHelper(dispatch, `Success: ${provider} ${name}`);
    } else {
      dispatchErrorHelper(
        dispatch,
        `Failed: ${provider} ${name}`,
        buildErrorMessage(rawPayload.error)
      );
    }
  };
}

//  ------------------------------------
// TODO: move to shared

function isError(arg: any): arg is Error {
  return arg.message;
}

function buildErrorMessage(
  error: string | BreadException | ServiceException | object
): string {
  if (typeof error === 'string') return error;

  if (isError(error)) return error.message;

  if (isObject(error)) return JSON.stringify(error, null, 2);

  return `unknown Error: ${error}`;
}
