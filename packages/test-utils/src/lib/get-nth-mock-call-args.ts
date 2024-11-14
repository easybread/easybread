/**
 * Get the arguments of the nth call of a mock function.
 * @param value
 * @param n call number, starting from 1
 */
export function getNthMockCallArgs(value: unknown, n: number) {
  if (!jest.isMockFunction(value)) {
    throw new Error(`Not a mock function: ${value}`);
  }

  return (value as jest.Mock).mock.calls[n - 1];
}
