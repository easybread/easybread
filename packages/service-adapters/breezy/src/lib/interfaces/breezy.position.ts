import type { BreezyUser } from './breezy.user.interface';

export type BreezyPosition = {
  _id: string;
  type: BreezyPositionType;
  state: BreezyPositionState;
  name: string;
  friendly_id: string;
  experience: BreezyExperience;
  location: BreezyLocation;
  education: string;
  department: string;
  requisition_id: string;
  description: string;
  category: BreezyCategory;
  application_form: BreezyApplicationForm;
  creator_id: string;
  creation_date: string;
  updated_date: string;
  questionnaire_id: string;
  scorecard_id: string;
  all_users: string[];
  all_admins: string[];
  pipeline_id: string;
  candidate_type: BreezyCandidateType;
  org_type: BreezyOrgType;
  custom_attributes: BreezyCustomAttribute[];
  tags: string[];
  pending_approval: BreezyPendingApproval;
};

export type BreezyPositionType = {
  id: string;
  name: string;
};

export type BreezyPositionState =
  | 'draft'
  | 'closed'
  | 'published'
  | 'archived'
  | 'pending';

export type BreezyExperience = {
  id: string;
  name: string;
};

export type BreezyLocation = {
  country: BreezyCountry;
  state: BreezyLocationState;
  city: string;
  name: string;
  is_remote: boolean;
};

export type BreezyCountry = {
  id: string;
  name: string;
};

export type BreezyLocationState = {
  id: string;
  name: string;
};

export type BreezyCategory = {
  id: string;
  name: string;
};

export type BreezyApplicationForm = {
  name: BreezyFormFieldRequirement;
  headline: BreezyFormFieldRequirement;
  summary: BreezyFormFieldRequirement;
  profile_photo: BreezyFormFieldRequirement;
  address: BreezyFormFieldRequirement;
  email_address: BreezyFormFieldRequirement;
  phone_number: BreezyFormFieldRequirement;
  resume: BreezyFormFieldRequirement;
  work_history: BreezyFormFieldRequirement;
  education: BreezyFormFieldRequirement;
  cover_letter: BreezyFormFieldRequirement;
};

export type BreezyFormFieldRequirement = 'required' | 'optional' | 'disabled';

export type BreezyCandidateType = 'all' | 'none' | 'unlisted' | 'internal';

export type BreezyOrgType = 'position' | 'pool';

export type BreezyCustomAttribute = {
  name: string;
  id: string;
  secure: boolean;
  value: string;
};

export type BreezyPendingApproval = {
  status: string;
  type: string;
  note: string;
  attachments: unknown[];
  approvers: BreezyUser[];
  approved_count: number;
  total_approver_count: number;
};
