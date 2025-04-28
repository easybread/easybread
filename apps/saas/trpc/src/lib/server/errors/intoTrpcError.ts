import { TRPCError } from '@trpc/server';

import { type DBError, DB_ERROR } from 'saas-errors';

type PossibleErrorName = DBError;

export function intoTrpcError<T extends { readonly name: PossibleErrorName }>(
  cause: T,
  message?: string,
) {
  // Runtime guardrails
  if (!cause) {
    console.warn('unexpected cause type', cause);
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      cause: 'unknown',
      message,
    });
  }

  if (typeof cause !== 'object' || !('name' in cause)) {
    console.warn('unexpected cause type', cause);
    return new TRPCError({ code: 'INTERNAL_SERVER_ERROR', cause, message });
  }

  // expected handling
  switch (cause.name) {
    case DB_ERROR.NOT_FOUND:
      return new TRPCError({
        code: 'NOT_FOUND',
        cause,
        message,
      });

    case DB_ERROR.QUERY_FAILED:
      return new TRPCError({
        code: 'SERVICE_UNAVAILABLE',
        cause,
        message,
      });

    case DB_ERROR.UNEXPECTED_EMPTY_RETURN_ARRAY:
      return new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        cause,
        message,
      });

    default:
      console.warn('unexpected cause', cause.name satisfies never);
      return new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        cause,
        message,
      });
  }
}
