import type { BreezyPosition } from '../../interfaces';

// Minimal position fixture: only `_id` is exercised by the applicant search
// flow. The object is cast via `as unknown as BreezyPosition[]`, so the other
// fields are NOT type-checked against `BreezyPosition` — keep that in mind when
// changing this mock.
export const POSITIONS_SEARCH_RESPONSE_MOCK = [
  {
    _id: 'position-one',
    name: 'Software Engineer',
    state: 'published',
  },
] as unknown as BreezyPosition[];
