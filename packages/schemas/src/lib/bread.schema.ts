export type BreadSchemaStatus =
  | 'IDLE'
  | 'READY'
  | 'IN_PROGRESS'
  | 'PAUSED'
  | 'CANCELED'
  | 'FAILED'
  | 'COMPLETED'
  | 'QUEUED';

export type BreadSchema = {
  identifier?: string;
  name?: string;
  statuses?: BreadSchemaStatus[];
};
