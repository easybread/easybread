import type { ThingSchema } from '../base/thing.schema';
import type { OrganizationSchema } from '../hr/organization.schema';
import type { ExtendableSchema } from '../util/extendable-schema';

import type { PersonSchema } from './person.schema';

export type RatingSchema = ExtendableSchema<ThingSchema> & {
  '@type': 'Rating';

  author?: PersonSchema | OrganizationSchema;

  ratingValue: number | string;

  bestRating?: number | string;

  worstRating?: number | string;

  /**
   * A short explanation (e.g. one to two sentences) providing background
   * context and other information that led to the conclusion expressed in the rating.
   */
  ratingExplanation?: string;

  /**
   * This Review or Rating is relevant to this part or facet of the itemReviewed.
   */
  reviewAspect?: string;
};
