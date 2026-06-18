import type { BreezyPosition } from '../../interfaces';

// Minimal position fixture: only the fields exercised by the applicant search
// flow (`_id`) are meaningful; the rest are filled to satisfy the type.
export const POSITIONS_SEARCH_RESPONSE_MOCK = [
  {
    _id: 'position-one',
    name: 'Software Engineer',
    state: 'published',
  },
] as unknown as BreezyPosition[];
