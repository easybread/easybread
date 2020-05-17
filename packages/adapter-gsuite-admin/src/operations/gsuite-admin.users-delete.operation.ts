import {
  BreadOperation,
  BreadOperationInputWithPayload,
  BreadOperationOutputWithPayload
} from '@easybread/core';
import { PersonSchema } from '@easybread/schemas';

import { GsuiteAdminOperationName } from '../gsuite-admin.operation-name';

export interface GsuiteAdminUsersDeleteOperation
  extends BreadOperation<GsuiteAdminOperationName.USERS_DELETE> {
  input: BreadOperationInputWithPayload<
    GsuiteAdminOperationName.USERS_DELETE,
    PersonSchema
  >;

  output: BreadOperationOutputWithPayload<
    GsuiteAdminOperationName.USERS_DELETE,
    PersonSchema
  >;
}
