import {
  BreadOperationInputWithParams,
  BreadOperationOutputWithRawDataAndPayload,
  BreadStandardOperation
} from '@easybread/core';
import { PersonSchema } from '@easybread/schemas';

import { GsuiteAdminOperationName } from '../gsuite-admin.operation-name';
import { GsuiteAdminUser } from '../interfaces';

export interface GsuiteAdminUsersByIdOperation
  extends BreadStandardOperation<GsuiteAdminOperationName.USERS_BY_ID> {
  input: BreadOperationInputWithParams<
    GsuiteAdminOperationName.USERS_BY_ID,
    Pick<PersonSchema, 'identifier'>
  >;

  output: BreadOperationOutputWithRawDataAndPayload<
    GsuiteAdminOperationName.USERS_BY_ID,
    GsuiteAdminUser,
    PersonSchema
  >;
}
