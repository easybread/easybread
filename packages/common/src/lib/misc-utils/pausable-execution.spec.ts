import { PausableExecution } from './pausable-execution';

const pausableExecution = new PausableExecution();

const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

const asyncFunctionFactory = {
  callsCount: 0,
  value: 1,
  reset() {
    this.callsCount = 0;
    this.value = 1;
  },
  make(): () => Promise<number> {
    // create value before creating a function.
    const value = this.value++;
    // return an async function
    return async () => {
      this.callsCount++;
      await sleep(300);
      return value;
    };
  }
};

describe('add()', () => {
  beforeEach(() => {
    asyncFunctionFactory.reset();
  });

  describe('in normal state', () => {
    it(`should immediately invoke the function and return it's result`, async () => {
      const actual = pausableExecution.add(asyncFunctionFactory.make());

      expect(pausableExecution.isPaused).toBe(false);

      expect(asyncFunctionFactory.callsCount).toEqual(1);
      expect(await actual).toEqual(1);
    });
  });

  describe('in paused state', () => {
    it(`should delay the execution until resume() is called`, async () => {
      pausableExecution.pause();

      expect(pausableExecution.isPaused).toBe(true);

      // added functions are not invoked
      const resultOne = pausableExecution.add(asyncFunctionFactory.make());
      const resultTwo = pausableExecution.add(asyncFunctionFactory.make());
      expect(asyncFunctionFactory.callsCount).toEqual(0);

      pausableExecution.resume();
      expect(pausableExecution.isPaused).toBe(false);

      // now every next added function invoked immediately again
      const resultThree = pausableExecution.add(asyncFunctionFactory.make());
      expect(asyncFunctionFactory.callsCount).toEqual(1);

      // skip a tick so that delayed async functions could run
      await sleep(0);
      expect(asyncFunctionFactory.callsCount).toEqual(3);

      // check results
      expect(await resultOne).toEqual(1);
      expect(await resultTwo).toEqual(2);
      expect(await resultThree).toEqual(3);
    });
  });
});
