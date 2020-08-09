import { PersonSchema } from '@easybread/schemas';

export type RocketChatUsersByIdOperationInputParams =
  | Pick<PersonSchema, 'identifier'>
  | Pick<PersonSchema, 'email'>;
