import {
  BreadOperation,
  BreadOperationInputWithPayload,
  BreadOperationOutputWithRawDataAndPayload
} from '@easybread/core';
import { PersonSchema } from '@easybread/schemas';

import { GsuiteAdminOperationName } from '../gsuite-admin.operation-name';
import { GsuiteAdminUser } from '../interfaces';

export interface GsuiteAdminUsersUpdateOperation
  extends BreadOperation<GsuiteAdminOperationName.USERS_UPDATE> {
  input: BreadOperationInputWithPayload<
    GsuiteAdminOperationName.USERS_UPDATE,
    PersonSchema
  >;
  output: BreadOperationOutputWithRawDataAndPayload<
    GsuiteAdminOperationName.USERS_UPDATE,
    GsuiteAdminUser,
    PersonSchema
  >;
}
