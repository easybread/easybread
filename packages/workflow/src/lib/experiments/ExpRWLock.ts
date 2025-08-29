type MethodName<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? K : never;
}[keyof T];

type LockPatternFactory = (...args: any[]) => string;
type LockPatterns<T> = {
  [K in MethodName<T>]?: string;
};

class ExpRWLock<
  T,
  KRA extends LockPatterns<T>,
  KWA extends LockPatterns<T>,
  KU extends keyof T = Exclude<keyof T, keyof KRA | keyof KWA>,
> {
  target: T;
  readKeys: KRA;
  writeKeys: KWA;

  constructor({
    target,
    readKeys,
    writeKeys,
  }: {
    target: T;
    readKeys: KRA;
    writeKeys: KWA;
  }) {
    this.target = target;
    this.readKeys = readKeys;
    this.writeKeys = writeKeys;
  }

  async unprotected<TResult>(fn: (target: Pick<T, KU>) => Promise<TResult>) {
    return fn(this.target);
  }

  async usingReadLock<TResult>(
    fn: (
      target: Pick<T, Extract<keyof KRA, keyof T>> & Pick<T, KU>,
    ) => Promise<TResult>,
  ) {
    return fn(this.target);
  }

  async usingWriteLock<TResult>(
    fn: (
      target: Pick<T, Extract<keyof KWA, keyof T>> & Pick<T, KU>,
    ) => Promise<TResult>,
  ) {
    return fn(this.target);
  }
}

interface Foo {
  id: string;
  name: string;
}

abstract class FooStore {
  abstract foo: string;
  abstract readMany(): Promise<Foo[]>;
  abstract read(id: string): Promise<Foo | null>;
  abstract write(foo: Foo): Promise<void>;
  abstract writeMany(foos: Foo[]): Promise<void>;
  abstract remove(id: string): Promise<void>;
  abstract removeMany(ids: string[]): Promise<void>;
}

declare const fooStore: FooStore;
type T1 = LockPatterns<any>;
type T2 = keyof T1;

const p = { read: 'foo' } satisfies LockPatterns<FooStore>;

const rwLock = new ExpRWLock({
  target: fooStore,
  readKeys: {
    read: 'foo',
    readMany: 'foo',
  },
  writeKeys: {
    write: 'foo',
    writeMany: 'foo',
    remove: 'foo',
    removeMany: 'foo',
  },
});

export async function main() {
  await rwLock.unprotected(async target => {
    return target.foo;
  });
  await rwLock.usingReadLock(async foo => {
    console.log(foo.foo);
    return foo.readMany();
  });
}
