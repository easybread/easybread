import type { CommandStandard } from '@easybread/core';
import type {
  AuthStartOauth2ResponseSchema,
  OrganizationSchema,
} from '@easybread/schemas';

import type { BAMBOO_HR_COMMAND_NAME } from '../bamboo-hr.command-name';

export type BambooAuthOidcStartCommand = CommandStandard<
  typeof BAMBOO_HR_COMMAND_NAME.AUTH_OIDC_START,
  OrganizationSchema,
  null,
  AuthStartOauth2ResponseSchema,
  { authUri: string }
>;

// export interface BambooHrOidcAuthStartOperation
//   extends BreadStandardOperation<BambooHrOperationName.OIDC_AUTH_START> {
//   input: BreadOperationInputWithPayload<
//     BambooHrOperationName.OIDC_AUTH_START,
//     BambooHrOidcAuthStartOperationInputPayload
//   >;
//
//   output: BreadOperationOutputWithRawData<
//     BambooHrOperationName.OIDC_AUTH_START,
//     BambooHrOidcAuthStartOperationOutputRawData
//   >;
// }
//
