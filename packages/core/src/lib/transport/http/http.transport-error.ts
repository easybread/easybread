import type { AxiosError } from 'axios';

export type HttpTransportError<TResponseData = unknown> =
  AxiosError<TResponseData>;
