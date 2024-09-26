import { OperationExecutor } from './operation-executor';
import { BreadOperationContext, BreadOperationHandler } from '../operation';
import { BreadServiceAdapterOptions } from '../common-interfaces';
import { type InternalAxiosRequestConfig } from 'axios';
import { createAxiosError } from '@easybread/test-utils';

let mockHandler: jest.Mocked<BreadOperationHandler<any, any, any>>;
let mockInput: any;
let mockOptions: BreadServiceAdapterOptions | null;
let mockContext: BreadOperationContext<any, any, any>;

beforeEach(() => {
  jest.restoreAllMocks();
  mockHandler = {
    name: 'mockOperation',
    handle: jest.fn(),
    shouldRetry: jest.fn(),
  };
  mockInput = { someInput: 'value' };
  mockOptions = null;
  mockContext = {} as BreadOperationContext<any, any, any>;
});

afterEach(() => {
  jest.useRealTimers();
});

it('should execute successfully without retries', async () => {
  const expectedOutput = { success: true };
  mockHandler.handle.mockResolvedValue(expectedOutput);

  const retrier = new OperationExecutor({
    handler: mockHandler,
    input: mockInput,
    options: mockOptions,
    context: mockContext,
  });

  const result = await retrier.execute();

  expect(result).toEqual(expectedOutput);
  expect(mockHandler.handle).toHaveBeenCalledTimes(1);
  expect(mockHandler.handle).toHaveBeenCalledWith(
    mockInput,
    mockContext,
    mockOptions
  );
});

it('should retry on errors when shouldRetry returns true', async () => {
  jest.useFakeTimers();

  const error = new Error('Temporary error');
  const expectedOutput = { success: true };

  mockHandler.handle
    .mockRejectedValueOnce(error)
    .mockRejectedValueOnce(error)
    .mockResolvedValue(expectedOutput);

  jest.mocked(mockHandler.shouldRetry)?.mockReturnValue(true);

  const retrier = new OperationExecutor({
    handler: mockHandler,
    input: mockInput,
    options: mockOptions,
    context: mockContext,
  });

  // first iteration
  const executePromise = retrier.execute();
  await Promise.resolve();

  expect(mockHandler.handle).toHaveBeenCalledTimes(1);
  expect(mockHandler.shouldRetry).toHaveBeenCalledTimes(1);

  // immediate retry
  await jest.advanceTimersByTimeAsync(0);

  expect(mockHandler.handle).toHaveBeenCalledTimes(2);
  expect(mockHandler.shouldRetry).toHaveBeenCalledTimes(2);

  // retry after 1 second
  await jest.advanceTimersByTimeAsync(1000);

  expect(mockHandler.handle).toHaveBeenCalledTimes(3);
  expect(mockHandler.shouldRetry).toHaveBeenCalledTimes(2);

  // final result
  await expect(executePromise).resolves.toEqual(expectedOutput);
});

it(`should pass the retries count to shouldRetry function`, async () => {
  jest.useFakeTimers();

  const error = new Error('Temporary error');
  const expectedOutput = { success: true };

  mockHandler.handle
    .mockRejectedValueOnce(error)
    .mockRejectedValueOnce(error)
    .mockResolvedValue(expectedOutput);

  jest.mocked(mockHandler.shouldRetry)?.mockReturnValue(true);

  const retrier = new OperationExecutor({
    handler: mockHandler,
    input: mockInput,
    options: mockOptions,
    context: mockContext,
  });

  const executePromise = retrier.execute();
  executePromise.catch(() => undefined);

  await jest.runAllTimersAsync();

  await expect(executePromise).resolves.toEqual(expectedOutput);
  expect(mockHandler.shouldRetry).toHaveBeenCalledTimes(2);
  expect(mockHandler.shouldRetry).toHaveBeenNthCalledWith(
    1,
    expect.any(Error),
    0
  );
  expect(mockHandler.shouldRetry).toHaveBeenNthCalledWith(
    2,
    expect.any(Error),
    1
  );
});

it('should respect the retry limit', async () => {
  jest.useFakeTimers();

  const error = new Error('Persistent error');

  mockHandler.handle.mockRejectedValue(error);
  jest.mocked(mockHandler.shouldRetry)?.mockReturnValue(true);

  const retrier = new OperationExecutor(
    {
      handler: mockHandler,
      input: mockInput,
      options: mockOptions,
      context: mockContext,
    },
    3
  );

  const executePromise = retrier.execute();
  executePromise.catch(() => undefined);

  // Advance timers for each retry
  for (let i = 0, delay = 0; i < 3; i++, delay = delay ? delay * 2 : 1000) {
    await jest.advanceTimersByTimeAsync(delay);
    // i+2 is because after the first timers tick, the retrier
    // will fail once on the initial call, and the second time
    // in the immediate retry.
    expect(mockHandler.shouldRetry).toHaveBeenCalledTimes(i + 2);
  }

  await expect(executePromise).rejects.toThrowError(
    'Operation mockOperation failed after 3 retries'
  );
  expect(mockHandler.handle).toHaveBeenCalledTimes(4);
  expect(mockHandler.shouldRetry).toHaveBeenCalledTimes(4);
});

it('should increase delay between retries by two times (by default) the previous delay except the first retry, which should run immediately', async () => {
  jest.useFakeTimers();

  const setTimeoutSpy = jest.spyOn(global, 'setTimeout');

  const error = new Error('Temporary error');
  const expectedOutput = { success: true };

  mockHandler.handle
    .mockRejectedValueOnce(error)
    .mockRejectedValueOnce(error)
    .mockRejectedValueOnce(error)
    .mockRejectedValueOnce(error)
    .mockResolvedValue(expectedOutput);

  jest.mocked(mockHandler.shouldRetry)?.mockReturnValue(true);

  const retrier = new OperationExecutor({
    handler: mockHandler,
    input: mockInput,
    options: mockOptions,
    context: mockContext,
  });

  const executePromise = retrier.execute();

  await jest.runAllTimersAsync();

  await expect(executePromise).resolves.toEqual(expectedOutput);
  expect(mockHandler.handle).toHaveBeenCalledTimes(5);
  expect(mockHandler.shouldRetry).toHaveBeenCalledTimes(4);

  // Check if the delays were increased
  expect(setTimeoutSpy).toHaveBeenNthCalledWith(1, expect.any(Function), 0);
  expect(setTimeoutSpy).toHaveBeenNthCalledWith(2, expect.any(Function), 1000);
  expect(setTimeoutSpy).toHaveBeenNthCalledWith(3, expect.any(Function), 2000);
  expect(setTimeoutSpy).toHaveBeenNthCalledWith(4, expect.any(Function), 4000);
});

it('should use the retryBackoffFactor defined on the handler object', async () => {
  jest.useFakeTimers();

  const error = new Error('Temporary error');
  const expectedOutput = { success: true };

  mockHandler.handle
    .mockRejectedValueOnce(error)
    .mockRejectedValueOnce(error)
    .mockRejectedValueOnce(error)
    .mockRejectedValueOnce(error)
    .mockResolvedValue(expectedOutput);

  jest.mocked(mockHandler.shouldRetry)?.mockReturnValue(true);

  mockHandler.retryBackoffFactor = 3;
  const retrier = new OperationExecutor({
    handler: mockHandler,
    input: mockInput,
    options: mockOptions,
    context: mockContext,
  });

  const setTimeoutSpy = jest.spyOn(global, 'setTimeout');

  const executePromise = retrier.execute();
  executePromise.catch(() => undefined);

  await jest.runAllTimersAsync();
  await executePromise;
  expect(setTimeoutSpy).toHaveBeenNthCalledWith(1, expect.any(Function), 0);
  expect(setTimeoutSpy).toHaveBeenNthCalledWith(2, expect.any(Function), 1000);
  expect(setTimeoutSpy).toHaveBeenNthCalledWith(3, expect.any(Function), 3000);
  expect(setTimeoutSpy).toHaveBeenNthCalledWith(4, expect.any(Function), 9000);
});

it('should throw the original error when shouldRetry returns false', async () => {
  jest.useFakeTimers();

  const error = new Error('Non-retryable error');

  mockHandler.handle.mockRejectedValue(error);
  jest.mocked(mockHandler.shouldRetry)?.mockReturnValue(false);

  const retrier = new OperationExecutor({
    handler: mockHandler,
    input: mockInput,
    options: mockOptions,
    context: mockContext,
  });

  const executePromise = retrier.execute();
  jest.runAllTimers();

  await expect(executePromise).rejects.toThrow('Non-retryable error');
  expect(mockHandler.handle).toHaveBeenCalledTimes(1);
  expect(mockHandler.shouldRetry).toHaveBeenCalledTimes(1);
});

it('should use default shouldRetry behavior when not provided', async () => {
  jest.useFakeTimers();

  const error = new Error('Some error');

  mockHandler.handle.mockRejectedValue(error);
  delete mockHandler.shouldRetry;

  const retrier = new OperationExecutor({
    handler: mockHandler,
    input: mockInput,
    options: mockOptions,
    context: mockContext,
  });

  const executePromise = retrier.execute();
  jest.runAllTimers();

  await expect(executePromise).rejects.toThrow('Some error');
  expect(mockHandler.handle).toHaveBeenCalledTimes(1);
});

it(`should retry the operation on 429 HTTP error if handler.shouldRetry returns null`, async () => {
  jest.useFakeTimers();

  const mockHandler = {
    name: 'mockOperation',
    handle: jest.fn().mockImplementation(async () => {
      throw createAxiosError('Some error', {
        status: 429,
        data: 'Too many requests',
        statusText: 'Too May Requests',
      });
    }),
    shouldRetry: jest.fn().mockReturnValue(null),
  } as unknown as BreadOperationHandler<any, any, any>;

  const retrier = new OperationExecutor({
    handler: mockHandler,
    input: mockInput,
    options: mockOptions,
    context: mockContext,
  });

  const executePromise = retrier.execute();
  executePromise.catch(() => undefined);

  await jest.runAllTimersAsync();

  expect(mockHandler.handle).toHaveBeenCalledTimes(11);
  expect(mockHandler.shouldRetry).toHaveBeenCalledTimes(11);
  await expect(executePromise).rejects.toThrow(
    'Operation mockOperation failed after 10 retries. Time taken: 511000 ms'
  );
});

it(`should not retry the operation on 429 HTTP error if handler.shouldRetry returns false`, async () => {
  jest.useFakeTimers();

  const mockHandler = {
    name: 'mockOperation',
    handle: jest.fn().mockImplementation(async () => {
      throw createAxiosError('Request failed with status code 429', {
        status: 429,
        data: 'Too many requests',
        statusText: 'Too May Requests',
      });
    }),
    shouldRetry: jest.fn().mockReturnValue(false),
  } as unknown as BreadOperationHandler<any, any, any>;

  const retrier = new OperationExecutor({
    handler: mockHandler,
    input: mockInput,
    options: mockOptions,
    context: mockContext,
  });

  const executePromise = retrier.execute();
  executePromise.catch(() => undefined);

  await jest.runAllTimersAsync();

  expect(mockHandler.handle).toHaveBeenCalledTimes(1);
  expect(mockHandler.shouldRetry).toHaveBeenCalledTimes(1);
  await expect(executePromise).rejects.toThrow(
    'Request failed with status code 429'
  );
});
