import { InMemoryStateAdapter } from './in-memory-state-adapter';

describe('InMemoryStateAdapter', () => {
  let adapter: InMemoryStateAdapter;

  beforeAll(() => {
    adapter = new InMemoryStateAdapter();
  });

  afterEach(async () => {
    await adapter.reset();
  });

  const oneKey = 'one';
  const oneInitialValue: One = { foo: 'value', bar: 1 };
  const twoKey = 'two';
  const twoInitialValue: Two = { baz: 'value', quix: true };

  // ------------------------------------

  describe('read() and write()', () => {
    it(`should allow creating and reading new entities`, async () => {
      expect(await adapter.write<One>(oneKey, oneInitialValue)).toEqual(
        oneInitialValue
      );
      expect(await adapter.read<One>(oneKey)).toEqual(oneInitialValue);
    });

    it(`should updating existing entities`, async () => {
      await adapter.write<One>(oneKey, oneInitialValue);
      await adapter.write<One>(oneKey, { foo: 'updated', bar: 1 });

      expect(await adapter.read(oneKey)).toEqual({
        foo: 'updated',
        bar: 1
      } as One);
    });
  });

  // ------------------------------------

  describe('reset()', () => {
    it(`should remove all data`, async () => {
      await createOne();
      await createTwo();
      await adapter.reset();

      expect(await adapter.read(oneKey)).toEqual(undefined);
      expect(await adapter.read(twoKey)).toEqual(undefined);
    });
  });

  // ------------------------------------

  describe('remove()', () => {
    it(`should remove and return the record`, async () => {
      const one = await createOne();
      const removed = await adapter.remove<One>(oneKey);

      expect(removed).toEqual(one);
      expect(await adapter.read(oneKey)).toEqual(undefined);
    });

    it(`should throw if record does not exist`, async () => {
      await createOne();
      await expect(adapter.remove<One>('not-existing')).rejects.toThrow(
        'Not found'
      );
    });
  });

  // ------------------------------------

  async function createOne(): Promise<One> {
    return adapter.write<One>(oneKey, oneInitialValue);
  }

  async function createTwo(): Promise<Two> {
    return adapter.write<Two>(twoKey, twoInitialValue);
  }
});

interface One {
  foo: string;
  bar: number;
}

interface Two {
  baz: string;
  quix: boolean;
}
