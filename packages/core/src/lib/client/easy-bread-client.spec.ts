import { PersonSchema } from '@easybread/schemas';
import { AxiosRequestConfig } from 'axios';

import {
  AuthStrategy,
  BreadCollectionOperation,
  BreadCollectionOperationInput,
  BreadCollectionOperationOutputWithPayload,
  type BreadOperationInputWithParamsAndPayload,
  type BreadOperationOutputWithRawDataAndPayload,
  type BreadStandardOperation,
  EasyBreadClient,
  InMemoryStateAdapter,
  ServiceAdapter,
  StateAdapter,
} from '../..';

class TestAuthStrategy extends AuthStrategy<object> {
  constructor(state: StateAdapter) {
    super(state, 'test');
  }

  async authenticate(
    _breadId: string,
    _payload: object | undefined,
  ): Promise<void> {
    return;
  }

  async authorizeHttp(
    _breadId: string,
    requestConfig: AxiosRequestConfig,
  ): Promise<AxiosRequestConfig> {
    return requestConfig;
  }
}
enum TestOpName {
  PAYLOAD = 'PAYLOAD',
  PREV_NEXT = 'TEST_PREV_NEXT',
  SKIP_COUNT = 'TEST_SKIP_COUNT',
}

interface TestSkipCountOperation
  extends BreadCollectionOperation<TestOpName.SKIP_COUNT, 'SKIP_COUNT'> {
  input: BreadCollectionOperationInput<TestOpName.SKIP_COUNT, 'SKIP_COUNT'>;

  output: BreadCollectionOperationOutputWithPayload<
    TestOpName.SKIP_COUNT,
    PersonSchema[],
    'SKIP_COUNT'
  >;
}

interface TestPrevNextOperation
  extends BreadCollectionOperation<TestOpName.PREV_NEXT, 'PREV_NEXT'> {
  input: BreadCollectionOperationInput<TestOpName.PREV_NEXT, 'PREV_NEXT'>;

  output: BreadCollectionOperationOutputWithPayload<
    TestOpName.PREV_NEXT,
    PersonSchema[],
    'PREV_NEXT'
  >;
}

type InputParams = { foo: string };
type InputPayload = { bar: string };
type OutputPayload = { baz: string };

interface TestPayloadOperation
  extends BreadStandardOperation<TestOpName.PAYLOAD> {
  input: BreadOperationInputWithParamsAndPayload<
    TestOpName.PAYLOAD,
    InputParams,
    InputPayload
  >;
  output: BreadOperationOutputWithRawDataAndPayload<
    TestOpName.PAYLOAD,
    OutputPayload,
    PersonSchema
  >;
}

type OperationTypes =
  | TestSkipCountOperation
  | TestPrevNextOperation
  | TestPayloadOperation;

class TestAdapter extends ServiceAdapter<OperationTypes, TestAuthStrategy> {
  provider = 'Test';
}

const state = new InMemoryStateAdapter();
const serviceAdapter = new TestAdapter();
const authStrategy = new TestAuthStrategy(state);

const client = new EasyBreadClient(state, serviceAdapter, authStrategy);

describe('allPages() async generator function', () => {
  describe('with SKIP_COUNT pagination', () => {
    beforeEach(() => {
      const totalCount = 378;
      jest.restoreAllMocks();
      jest.spyOn(client, 'invoke').mockImplementation(async (name, data) => {
        if (!('pagination' in data)) throw new Error('No pagination');

        if ('pagination' in data && data.pagination.type === 'PREV_NEXT') {
          throw new Error('PREV_NEXT not supported in this test');
        }

        return {
          name,
          pagination: { ...data.pagination, totalCount },
          provider: 'Test',
          payload: [],
          rawPayload: { success: true },
        } as OperationTypes['output'];
      });
    });

    it(`should return an async generator`, () => {
      const actual = client.allPages(TestOpName.SKIP_COUNT, {
        breadId: '1',
        pagination: {
          type: 'SKIP_COUNT',
          count: 120,
          skip: 0,
        },
      });

      expect(actual[Symbol.asyncIterator]).toBeDefined();
    });

    it(`should fetch the entire collection`, async () => {
      const results: TestSkipCountOperation['output'][] = [];

      for await (const result of client.allPages(TestOpName.SKIP_COUNT, {
        pagination: {
          type: 'SKIP_COUNT',
          count: 120,
          skip: 0,
        },
        breadId: '1',
      })) {
        results.push(result);
      }

      expect((client.invoke as jest.Mock).mock.calls).toEqual([
        [
          TestOpName.SKIP_COUNT,
          {
            breadId: '1',
            pagination: { count: 120, skip: 0, type: 'SKIP_COUNT' },
          },
        ],
        [
          TestOpName.SKIP_COUNT,
          {
            breadId: '1',
            pagination: { count: 120, skip: 120, type: 'SKIP_COUNT' },
          },
        ],
        [
          TestOpName.SKIP_COUNT,
          {
            breadId: '1',
            pagination: { count: 120, skip: 240, type: 'SKIP_COUNT' },
          },
        ],
        [
          TestOpName.SKIP_COUNT,
          {
            breadId: '1',
            pagination: { count: 120, skip: 360, type: 'SKIP_COUNT' },
          },
        ],
      ]);

      expect(results).toEqual([
        {
          name: TestOpName.SKIP_COUNT,
          pagination: {
            count: 120,
            skip: 0,
            totalCount: 378,
            type: 'SKIP_COUNT',
          },
          payload: [],
          provider: 'Test',
          rawPayload: { success: true },
        },
        {
          name: TestOpName.SKIP_COUNT,
          pagination: {
            count: 120,
            skip: 120,
            totalCount: 378,
            type: 'SKIP_COUNT',
          },
          payload: [],
          provider: 'Test',
          rawPayload: { success: true },
        },
        {
          name: TestOpName.SKIP_COUNT,
          pagination: {
            count: 120,
            skip: 240,
            totalCount: 378,
            type: 'SKIP_COUNT',
          },
          payload: [],
          provider: 'Test',
          rawPayload: { success: true },
        },
        {
          name: TestOpName.SKIP_COUNT,
          pagination: {
            count: 120,
            skip: 360,
            totalCount: 378,
            type: 'SKIP_COUNT',
          },
          payload: [],
          provider: 'Test',
          rawPayload: { success: true },
        },
      ]);
    });
  });

  describe('with PREV_NEXT pagination', () => {
    beforeEach(() => {
      const lastPage = 3;
      const createNextPage = (
        currentPage?: number | string,
      ): number | undefined => {
        const numberCurrent = Number(currentPage);

        if (!numberCurrent) return 1;

        return numberCurrent < lastPage ? numberCurrent + 1 : undefined;
      };

      jest.restoreAllMocks();
      jest.spyOn(client, 'invoke').mockImplementation(async (name, data) => {
        if (!('pagination' in data)) throw new Error('No pagination');

        if (data.pagination.type === 'SKIP_COUNT') {
          throw new Error('PREV_NEXT not supported in this test');
        }

        const { pagination } = data;

        const next = createNextPage(pagination.page);

        return {
          name,
          pagination: { type: 'PREV_NEXT', pipe: next },
          provider: 'Test',
          payload: [],
          rawPayload: { success: true },
        } as OperationTypes['output'];
      });
    });

    it(`should fetch the entire collection`, async () => {
      const results: TestPrevNextOperation['output'][] = [];

      for await (const result of client.allPages(TestOpName.PREV_NEXT, {
        pagination: { type: 'PREV_NEXT' },
        breadId: '1',
      })) {
        results.push(result);
      }

      expect((client.invoke as jest.Mock).mock.calls).toEqual([
        [
          TestOpName.PREV_NEXT,
          {
            breadId: '1',
            pagination: { type: 'PREV_NEXT' },
          },
        ],
        [
          TestOpName.PREV_NEXT,
          {
            breadId: '1',
            pagination: { page: 1, type: 'PREV_NEXT' },
          },
        ],
        [
          TestOpName.PREV_NEXT,
          {
            breadId: '1',
            pagination: { page: 2, type: 'PREV_NEXT' },
          },
        ],
        [
          TestOpName.PREV_NEXT,
          {
            breadId: '1',
            pagination: { page: 3, type: 'PREV_NEXT' },
          },
        ],
      ]);

      expect(results).toEqual([
        {
          name: TestOpName.PREV_NEXT,
          pagination: { next: 1, type: 'PREV_NEXT' },
          payload: [],
          provider: 'Test',
          rawPayload: { success: true },
        },
        {
          name: TestOpName.PREV_NEXT,
          pagination: { next: 2, type: 'PREV_NEXT' },
          payload: [],
          provider: 'Test',
          rawPayload: { success: true },
        },
        {
          name: TestOpName.PREV_NEXT,
          pagination: { next: 3, type: 'PREV_NEXT' },
          payload: [],
          provider: 'Test',
          rawPayload: { success: true },
        },
        {
          name: TestOpName.PREV_NEXT,
          pagination: { type: 'PREV_NEXT' },
          payload: [],
          provider: 'Test',
          rawPayload: { success: true },
        },
      ]);
    });
  });

  describe('unAuthenticate()', () => {
    it(`should remove auth data`, async () => {
      const id = '1';
      await client.unAuthenticate(id);
      await expect(authStrategy.readAuthData(id)).rejects.toThrowError(
        `no auth data in the state for 1`,
      );
    });
  });
});
