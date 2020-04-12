interface FetchResultBase<T> {
  data: T | null;
  idle: boolean;
  pending: boolean;
  error: boolean;
}

interface IdlingFetchResult<T> extends FetchResultBase<T> {
  data: null;
  idle: true;
  pending: false;
  error: false;
}

interface SuccessFetchResult<T> extends FetchResultBase<T> {
  data: T;
  idle: false;
  pending: false;
  error: false;
}

interface FailedFetchResult<T> extends FetchResultBase<T> {
  data: null;
  idle: false;
  pending: false;
  error: true;
}

interface PendingFetchResult<T> extends FetchResultBase<T> {
  data: null;
  idle: false;
  pending: true;
  error: false;
}

interface PendingFetchResult<T> extends FetchResultBase<T> {
  data: null;
  pending: true;
  error: false;
}

export type FetchResult<T> =
  | IdlingFetchResult<T>
  | SuccessFetchResult<T>
  | FailedFetchResult<T>
  | PendingFetchResult<T>;
