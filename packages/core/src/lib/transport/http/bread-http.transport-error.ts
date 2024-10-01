import type { AxiosError } from 'axios';

export type BreadHttpTransportError<TResponseData> = AxiosError<TResponseData>;
