import type { ThingSchema } from '../base/thing.schema';
import type { PersonSchema } from '../common/person.schema';
import type { ExtendableSchema } from '../util/extendable-schema';

export type OrganizationRoleSchema = ExtendableSchema<ThingSchema> & {
  '@type': 'OrganizationRole';
  member: PersonSchema;
};
