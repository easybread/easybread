import type {
  CommandStandardAny,
  inferCommandOutputSuccessful,
} from '../command';

export type CommandOutputStandardSuccessfulProps<T extends CommandStandardAny> =
  {
    breadId: string;
    payload: inferCommandOutputSuccessful<T>['payload'];
    rawPayload: inferCommandOutputSuccessful<T>['rawPayload'];
  };

export function commandOutputStandardSuccessful<T extends CommandStandardAny>(
  props: CommandOutputStandardSuccessfulProps<T>,
): inferCommandOutputSuccessful<T> {
  const { payload, rawPayload, breadId } = props;
  return {
    success: true,
    breadId,
    payload,
    rawPayload,
  } as inferCommandOutputSuccessful<T>;
}
