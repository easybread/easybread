// export type BreadSchemaStatus =
//   | 'IDLE'
//   | 'READY'
//   | 'IN_PROGRESS'
//   | 'PAUSED'
//   | 'CANCELED'
//   | 'FAILED'
//   | 'COMPLETED'
//   | 'QUEUED';

export type ThingSchema = {
  '@type': 'Thing';
  identifier?: string;
  name?: string;
  createdAt?: string;
  updatedAt?: string;
};
