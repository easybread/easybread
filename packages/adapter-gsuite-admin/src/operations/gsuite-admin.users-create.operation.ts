import {
  BreadOperation,
  BreadOperationInputWithPayload,
  BreadOperationOutputWithRawDataAndPayload
} from '@easybread/core';
import { PersonSchema } from '@easybread/schemas';

import { GsuiteAdminOperationName } from '../gsuite-admin.operation-name';
import { GsuiteAdminUser } from '../interfaces';

export interface GsuiteAdminUsersCreateOperation
  extends BreadOperation<GsuiteAdminOperationName.USERS_CREATE> {
  input: BreadOperationInputWithPayload<
    GsuiteAdminOperationName.USERS_CREATE,
    PersonSchema
  >;
  output: BreadOperationOutputWithRawDataAndPayload<
    GsuiteAdminOperationName.USERS_CREATE,
    GsuiteAdminUser,
    PersonSchema
  >;
}
