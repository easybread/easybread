import { takeFirstOrErr } from './takeFirstOrErr';

describe('takeFirstOrErr', () => {
  it('returns an Ok with the first element when the array is non-empty', () => {
    const result = takeFirstOrErr('not-found')([1, 2, 3]);

    expect(result.isOk()).toBe(true);
    expect(result._unsafeUnwrap()).toBe(1);
  });

  it('returns an Err with the provided error when the array is empty', () => {
    const result = takeFirstOrErr('not-found')([]);

    expect(result.isErr()).toBe(true);
    expect(result._unsafeUnwrapErr()).toBe('not-found');
  });

  it('returns an Err when the first element is falsy', () => {
    const result = takeFirstOrErr('not-found')([0, 1]);

    expect(result.isErr()).toBe(true);
    expect(result._unsafeUnwrapErr()).toBe('not-found');
  });

  it('supports non-primitive error values', () => {
    const error = { code: 'NOT_FOUND' as const };
    const result = takeFirstOrErr(error)([]);

    expect(result._unsafeUnwrapErr()).toEqual(error);
  });
});
