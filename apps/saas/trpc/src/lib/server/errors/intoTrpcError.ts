import { TRPCError } from '@trpc/server';

import { ERR_CODE, type ErrCode } from 'saas-errors';

export function intoTrpcError<T extends { readonly name: ErrCode }>(
  cause: T,
  message?: string,
) {
  console.error(cause);

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
    case ERR_CODE.enum.DB_NOT_FOUND:
      return new TRPCError({
        code: 'NOT_FOUND',
        cause,
        message,
      });

    case ERR_CODE.enum.DB_QUERY_FAILED:
      return new TRPCError({
        code: 'SERVICE_UNAVAILABLE',
        cause,
        message,
      });

    case ERR_CODE.enum.DB_UNEXPECTED_EMPTY_RETURN_ARRAY:
      return new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        cause,
        message,
      });

    case ERR_CODE.enum.CORE_OWNERSHIP_VIOLATION:
      return new TRPCError({
        code: 'FORBIDDEN',
        cause,
        message,
      });

    case ERR_CODE.enum.CORE_UNKNOWN_ERROR:
      return new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        cause,
        message,
      });

    case ERR_CODE.enum.CONNECTIONS_NO_SETTINGS:
      return new TRPCError({
        code: 'BAD_REQUEST',
        cause,
        message,
      });

    case ERR_CODE.enum.CONNECTIONS_UNSUPPORTED_TYPE:
      return new TRPCError({
        code: 'BAD_REQUEST',
        cause,
        message,
      });

    case ERR_CODE.enum.DATA_MODEL_INTROSPECTION_FAILED:
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
