import type { BreezyCandidate } from '../../interfaces';

// Minimal candidate fixture covering the fields mapped by
// `breezyCandidateAdapter.toInternal`.
export const CANDIDATES_RESPONSE_MOCK = [
  {
    _id: 'candidate-one',
    email_address: 'jane.doe@mail.com',
    name: 'Jane Doe',
    profile_photo_url: 'https://breezy.hr/photos/jane.png',
    address: 'New York, NY',
    creation_date: '2025-03-30T01:00:00.000Z',
    updated_date: '2025-04-02T01:00:00.000Z',
    phone_number: '+15551234567',
  },
] as unknown as BreezyCandidate[];
