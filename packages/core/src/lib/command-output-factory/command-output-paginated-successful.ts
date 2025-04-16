import type {
  CommandPaginatedAny,
  inferCommandOutputSuccessful,
} from '../command';

export type CommandOutputPaginatedSuccessfulProps<
  T extends CommandPaginatedAny,
> = {
  breadId: string;
  payload: inferCommandOutputSuccessful<T>['payload'];
  rawPayload: inferCommandOutputSuccessful<T>['rawPayload'];
  pagination: inferCommandOutputSuccessful<T>['pagination'];
};
export function commandOutputPaginatedSuccessful<T extends CommandPaginatedAny>(
  props: CommandOutputPaginatedSuccessfulProps<T>,
): inferCommandOutputSuccessful<T> {
  const { payload, rawPayload, breadId, pagination } = props;
  return {
    success: true,
    breadId,
    payload,
    rawPayload,
    pagination,
  } as inferCommandOutputSuccessful<T>;
}
