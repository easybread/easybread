import { z } from 'zod';

export const DtoUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  emailVerified: z.boolean(),
  image: z.string().nullable(),
});

export type DtoUser = z.infer<typeof DtoUserSchema>;
