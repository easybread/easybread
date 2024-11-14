import { getNthMockCallArgs } from './get-nth-mock-call-args';

/**
 * Get the mth argument of the nth call of a mock function.
 * @param value
 * @param n call number, starting from 1
 * @param m argument number, starting from 1
 */
export function getNthMockCallMthArg<TExpectedArgType>(
  value: unknown,
  n: number,
  m: number
) {
  return getNthMockCallArgs(value, n)[m - 1] as TExpectedArgType;
}
