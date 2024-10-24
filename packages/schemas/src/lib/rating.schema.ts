import type { BreadSchema } from './bread.schema';
import type { PersonSchema } from './person.schema';
import type { OrganizationSchema } from './organization.schema';

export type RatingSchema = BreadSchema & {
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
