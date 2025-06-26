import { err, ok } from 'neverthrow';

import { ERR_CODE, errObject } from 'saas-errors';

export function ownershipCheck<T extends Record<string, unknown>>(
  subject: T,
  orgKey: keyof T,
  orgId: string,
) {
  if (subject[orgKey] !== orgId) {
    return err(errObject(ERR_CODE.enum.CORE_OWNERSHIP_VIOLATION));
  }

  return ok(true);
}
