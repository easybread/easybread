import { z } from 'zod';

import { DtoUserSchema } from './DtoUser';

export const DtoAuthInfoSchema = z.object({
  user: DtoUserSchema,
  userOrgs: z.object({
    defaultOrg: z.string(),
    activeOrg: z.string(),
    memberOf: z.array(z.string()),
  }),
});

export type DtoAuthInfo = z.infer<typeof DtoAuthInfoSchema>;
