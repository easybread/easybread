import { BreadException } from './bread-exception';

export interface RetriesLimitReachedExceptionProps {
  retriesCount: number;
  startTime: number;
  endTime: number;
  operationName: string;
  input?: unknown;
  options?: unknown;
  cause?: unknown;
}

export class RetriesLimitReachedException extends BreadException {
  startTime: RetriesLimitReachedExceptionProps['startTime'];
  endTime: RetriesLimitReachedExceptionProps['endTime'];
  operationName: RetriesLimitReachedExceptionProps['operationName'];
  input: RetriesLimitReachedExceptionProps['input'];
  options: RetriesLimitReachedExceptionProps['options'];
  retriesCount: RetriesLimitReachedExceptionProps['retriesCount'];

  constructor({
    retriesCount,
    startTime,
    endTime,
    operationName,
    input,
    options,
    cause,
  }: RetriesLimitReachedExceptionProps) {
    super(
      `Operation ${operationName} failed after ${retriesCount} retries. Time taken: ${
        endTime - startTime
      } ms`
    );

    this.startTime = startTime;
    this.endTime = endTime;
    this.operationName = operationName;
    this.input = input;
    this.options = options;
    this.retriesCount = retriesCount;
    this.cause = cause;
  }
}
