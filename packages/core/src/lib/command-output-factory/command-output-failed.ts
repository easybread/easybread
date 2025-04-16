import type { CommandBaseOutputFailed } from '../command';
import { ServiceException } from '../exception';

export function commandOutputFailed(
  breadId: string,
  error: ServiceException,
): CommandBaseOutputFailed {
  return {
    success: false,
    breadId,
    error,
  };
}
