import type { ActionStatusTypeSchema } from './action-status-type.schema';
import type { OrganizationSchema } from './organization.schema';
import type { PersonSchema } from './person.schema';
import type { BreadSchema } from './bread.schema';
import type { AnySchema } from './any.schema';

export type ActionSchema = BreadSchema & {
  '@type': 'Action';
  /**
   * Indicates the current disposition of the Action.
   */
  actionStatus?: ActionStatusTypeSchema;

  /**
   * The direct performer or driver of the action (animate or inanimate).
   */
  agent?: OrganizationSchema | PersonSchema;

  /**
   * The object upon which the action is carried out, whose state is kept intact or changed.
   * Also known as the semantic roles patient,
   * affected or undergoer (which change their state) or theme (which doesn't).
   */
  object?: AnySchema;

  /**
   * Other co-agents that participated in the action indirectly.
   */
  participant?: OrganizationSchema | PersonSchema;

  /**
   * The service provider, service operator, or service performer;
   * the goods producer. Another party (a seller) may offer those services
   * or goods on behalf of the provider.
   * A provider may also serve as the seller.
   * Supersedes carrier.
   */
  provider?: OrganizationSchema | PersonSchema;

  /**
   * The result produced in the action.
   */
  result?: AnySchema;

  starTime?: string;
  endTime?: string;
};
