import type { CommandStandard } from '@easybread/core';
import type {
  AuthCredentialBasicSchema,
  PersonSchema,
} from '@easybread/schemas';

import type { BREEZY_COMMAND_NAME } from '../breezy.command-name';
import type { BreezyAuthenticateResponse } from '../interfaces';

export type BreezyAuthBasicSetCommand = CommandStandard<
  typeof BREEZY_COMMAND_NAME.AUTH_BASIC_SET,
  null,
  AuthCredentialBasicSchema,
  PersonSchema,
  BreezyAuthenticateResponse
>;
