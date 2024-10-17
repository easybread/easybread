export type BambooApplicationListQuery = {
  page?: number;
  jobId?: number;
  applicationStatusId?: number;
  applicationStatus?:
    | 'ALL'
    | 'ALL_ACTIVE'
    | 'NEW'
    | 'ACTIVE'
    | 'INACTIVE'
    | 'HIRED';
  jobStatusGroups?:
    | 'ALL'
    | 'DRAFT_AND_OPEN'
    | 'Open'
    | 'Filled'
    | 'Draft'
    | 'Deleted'
    | 'On Hold'
    | 'Cancelled';
  searchString?: string;
  sortOrder?: 'ASC' | 'DESC';
  sortBy?:
    | 'first_name'
    | 'job_title'
    | 'rating'
    | 'phone'
    | 'status'
    | 'last_updated'
    | 'created_date';
  newSince?: string;
};
