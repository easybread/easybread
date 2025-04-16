import { breadDataAdapter } from '@easybread/data-adapter';
import { NO_MAP } from '@easybread/data-mapper';
import type { PersonSchema } from '@easybread/schemas';

import type { BreezyCandidate } from '../interfaces';

export const breezyCandidateAdapter = breadDataAdapter<
  PersonSchema,
  BreezyCandidate
>({
  toExternal: {
    _id: 'identifier',
    email_address: 'email',
    name: _ => [_.givenName, _.familyName].filter(Boolean).join(' '),
    profile_photo_url: 'image',
    address: 'workLocation',
    creation_date: 'createdAt',
    updated_date: 'updatedAt',
    phone_number: 'telephone',
    meta_id: NO_MAP,
    assigned_to: NO_MAP,
    cover_letter: NO_MAP,
    education: NO_MAP,
    followed_by: NO_MAP,
    headline: NO_MAP,
    initial: NO_MAP,
    origin: NO_MAP,
    overall_score: NO_MAP,
    questionnaire: NO_MAP,
    recruited_by: NO_MAP,
    referred_by: NO_MAP,
    sourced_by: NO_MAP,
    resume: NO_MAP,
    social_profiles: NO_MAP,
    source: NO_MAP,
    stage: NO_MAP,
    summary: NO_MAP,
    tags: NO_MAP,
    work_history: NO_MAP,
    custom_attributes: NO_MAP,
    disposition_date: NO_MAP,
    disposition_reason: NO_MAP,
  },
  toInternal: {
    '@type': _ => 'Person',
    identifier: '_id',
    email: 'email_address',
    name: _ => _.name,
    givenName: _ => _.name?.split(' ')[0],
    familyName: _ => _.name?.split(' ')[1],
    image: 'profile_photo_url',
    workLocation: 'address',
    createdAt: 'creation_date',
    updatedAt: 'updated_date',
    telephone: 'phone_number',
  },
});
