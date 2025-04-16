export type {
  BambooJobApplicantSearchCommand,
  BambooJobApplicationSearchCommand,
  BambooAuthOidcCompleteCommand,
  BambooEmployeeCreateCommand,
  BambooAuthBasicSetCommand,
  BambooAuthOidcStartCommand,
  BambooEmployeeByIdCommand,
  BambooEmployeeSearchCommand,
} from './lib/commands';

export type {
  BambooEmployee,
  BambooEmployeeField,
  BambooApplication,
  BambooApplicationList,
  BambooApplicationListQuery,
  BambooAuthStateData,
  BambooBasicAuthPayload,
  BambooEmployeesDirectory,
  BambooOidcConnectionAttemptStateData,
  BambooOidcLoginPayload,
  BambooOidcTokenPayload,
} from './lib/interfaces';

export { BAMBOO_HR_PROVIDER_NAME } from './lib/bamboo-hr.constants';
export { BAMBOO_HR_COMMAND_NAME } from './lib/bamboo-hr.command-name';

export { BambooHrAdapter } from './lib/bamboo-hr.adapter';
export {
  BambooHrAuthStrategy,
  type BambooHrAuthStrategyOidcOptions,
} from './lib/bamboo-hr.auth-strategy';
