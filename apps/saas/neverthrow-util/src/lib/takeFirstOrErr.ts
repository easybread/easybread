import { err, ok } from 'neverthrow';

export const takeFirstOrErr =
  <E>(error: E) =>
  <A extends ArrayLike<unknown>>(arr: A) =>
    arr[0] ? ok(arr[0] as A[0]) : err(error);
