import type { BreezyUser } from './breezy.user.interface';

export type BreezyCandidate = {
  _id: string;
  meta_id: string;
  address: string;
  assigned_to: BreezyUser;
  cover_letter: string;
  creation_date: string;
  education: BreezyEducation[];
  email_address: string;
  followed_by: BreezyFollowedBy;
  headline: string;
  initial: string;
  name: string;
  origin: 'applied' | 'recruiter' | 'referral' | 'sourced';
  overall_score: BreezyOverallScore;
  phone_number: string;
  profile_photo_url: string;
  questionnaire: BreezyQuestionnaireItem[];
  recruited_by: BreezySimpleUser;
  referred_by: BreezySimpleUser;
  sourced_by: BreezySimpleUser;
  resume: BreezyResume;
  social_profiles: BreezySocialProfile[];
  source: BreezySource;
  stage: BreezyStage;
  summary: string;
  tags: string[];
  updated_date: string;
  work_history: BreezyWorkHistoryItem[];
  custom_attributes: BreezyCustomAttribute[];
  disposition_date: string;
  disposition_reason: BreezyDispositionReason;
};

export type BreezyEducation = {
  school_name: string;
  field_of_study: string;
  degree: string;
  is_current: boolean;
};

export type BreezyFollowedBy = Record<string, unknown>;

export type BreezyOverallScore = {
  very_good: string[];
  good: string[];
  neutral: string[];
  poor: string[];
  very_poor: string[];
  scored_count: number;
  score: number;
};

export type BreezySimpleUser = {
  _id: string;
  email_address: string;
  name: string;
};

export type BreezyResume = {
  file_name: string;
  url: string;
  pdf_url: string;
};

export type BreezySocialProfile = {
  type: string;
  typeId: string;
  typeName: string;
  url: string;
};

export type BreezySource = {
  id: string;
  name: string;
  type: string;
};

export type BreezyStage = {
  id: string;
  name: string;
  type: string;
};

export type BreezyQuestionnaireItem = Record<string, unknown>;

export type BreezyMonthYear = {
  month: number;
  year: number;
};

export type BreezyWorkHistoryItem = {
  company_name: string;
  title: string;
  summary: string;
  is_current: boolean;
  start_date: BreezyMonthYear;
  end_date: BreezyMonthYear;
};

export type BreezyCustomAttribute = {
  name: string;
  id: string;
  secure: boolean;
  value: string;
};

export type BreezyDispositionReason = {
  _id: string;
  name: string;
};
