import { PersonSchema } from '@easybread/schemas';
import { AxiosRequestConfig } from 'axios';

import {
  BreadAuthStrategy,
  BreadCollectionOperation,
  BreadCollectionOperationInput,
  BreadCollectionOperationOutputWithPayload,
  BreadServiceAdapter,
  BreadStateAdapter,
  EasyBreadClient,
  InMemoryStateAdapter,
} from '../..';

class TestAuthStrategy extends BreadAuthStrategy<object> {
  constructor(state: BreadStateAdapter) {
    super(state, 'test');
  }

  async authenticate(
    _breadId: string,
    _payload: object | undefined
  ): Promise<void> {
    return;
  }

  async authorizeHttp(
    _breadId: string,
    requestConfig: AxiosRequestConfig
  ): Promise<AxiosRequestConfig> {
    return requestConfig;
  }
}

interface TestSkipCountOperation
  extends BreadCollectionOperation<'TEST_SKIP_COUNT', 'SKIP_COUNT'> {
  input: BreadCollectionOperationInput<'TEST_SKIP_COUNT', 'SKIP_COUNT'>;

  output: BreadCollectionOperationOutputWithPayload<
    'TEST_SKIP_COUNT',
    PersonSchema[],
    'SKIP_COUNT'
  >;
}

interface TestPrevNextOperation
  extends BreadCollectionOperation<'TEST_PREV_NEXT', 'PREV_NEXT'> {
  input: BreadCollectionOperationInput<'TEST_PREV_NEXT', 'PREV_NEXT'>;

  output: BreadCollectionOperationOutputWithPayload<
    'TEST_PREV_NEXT',
    PersonSchema[],
    'PREV_NEXT'
  >;
}

type OperationTypes = TestSkipCountOperation | TestPrevNextOperation;

class TestAdapter extends BreadServiceAdapter<
  OperationTypes,
  TestAuthStrategy
> {
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
      jest.spyOn(client, 'invoke').mockImplementation(async (input) => {
        if (!('pagination' in input)) throw new Error('No pagination');

        const { pagination, name } = input;

        if (input.pagination.type === 'PREV_NEXT') {
          throw new Error('PREV_NEXT not supported in this test');
        }

        return {
          name,
          pagination: { ...pagination, totalCount },
          provider: 'Test',
          payload: [],
          rawPayload: { success: true },
        } as OperationTypes['output'];
      });
    });

    it(`should return an async generator`, () => {
      client.invoke<TestSkipCountOperation>({
        pagination: {
          type: 'SKIP_COUNT',
          count: 120,
          skip: 0,
        },
        name: 'TEST_SKIP_COUNT',
        breadId: '1',
      });

      const actual = client.allPages<TestSkipCountOperation>({
        pagination: {
          type: 'SKIP_COUNT',
          count: 120,
          skip: 0,
        },
        name: 'TEST_SKIP_COUNT',
        breadId: '1',
      });

      expect(actual[Symbol.asyncIterator]).toBeDefined();
    });

    it(`should fetch the entire collection`, async () => {
      const results: TestSkipCountOperation['output'][] = [];

      for await (const result of client.allPages<TestSkipCountOperation>({
        pagination: {
          type: 'SKIP_COUNT',
          count: 120,
          skip: 0,
        },
        name: 'TEST_SKIP_COUNT',
        breadId: '1',
      })) {
        results.push(result);
      }

      expect((client.invoke as jest.Mock).mock.calls).toEqual([
        [
          {
            breadId: '1',
            name: 'TEST_SKIP_COUNT',
            pagination: { count: 120, skip: 0, type: 'SKIP_COUNT' },
          },
        ],
        [
          {
            breadId: '1',
            name: 'TEST_SKIP_COUNT',
            pagination: { count: 120, skip: 120, type: 'SKIP_COUNT' },
          },
        ],
        [
          {
            breadId: '1',
            name: 'TEST_SKIP_COUNT',
            pagination: { count: 120, skip: 240, type: 'SKIP_COUNT' },
          },
        ],
        [
          {
            breadId: '1',
            name: 'TEST_SKIP_COUNT',
            pagination: { count: 120, skip: 360, type: 'SKIP_COUNT' },
          },
        ],
      ]);

      expect(results).toEqual([
        {
          name: 'TEST_SKIP_COUNT',
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
          name: 'TEST_SKIP_COUNT',
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
          name: 'TEST_SKIP_COUNT',
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
          name: 'TEST_SKIP_COUNT',
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
        currentPage?: number | string
      ): number | undefined => {
        const numberCurrent = Number(currentPage);

        if (!numberCurrent) return 1;

        return numberCurrent < lastPage ? numberCurrent + 1 : undefined;
      };

      jest.restoreAllMocks();
      jest.spyOn(client, 'invoke').mockImplementation(async (input) => {
        if (!('pagination' in input)) throw new Error('No pagination');

        if (input.pagination.type === 'SKIP_COUNT') {
          throw new Error('PREV_NEXT not supported in this test');
        }

        const { pagination, name } = input;
        const next = createNextPage(pagination.page);
        return {
          name,
          pagination: { type: 'PREV_NEXT', next },
          provider: 'Test',
          payload: [],
          rawPayload: { success: true },
        } as OperationTypes['output'];
      });
    });

    it(`should fetch the entire collection`, async () => {
      const results: TestPrevNextOperation['output'][] = [];

      for await (const result of client.allPages<TestPrevNextOperation>({
        pagination: { type: 'PREV_NEXT' },
        name: 'TEST_PREV_NEXT',
        breadId: '1',
      })) {
        results.push(result);
      }

      expect((client.invoke as jest.Mock).mock.calls).toEqual([
        [
          {
            breadId: '1',
            name: 'TEST_PREV_NEXT',
            pagination: { type: 'PREV_NEXT' },
          },
        ],
        [
          {
            breadId: '1',
            name: 'TEST_PREV_NEXT',
            pagination: { page: 1, type: 'PREV_NEXT' },
          },
        ],
        [
          {
            breadId: '1',
            name: 'TEST_PREV_NEXT',
            pagination: { page: 2, type: 'PREV_NEXT' },
          },
        ],
        [
          {
            breadId: '1',
            name: 'TEST_PREV_NEXT',
            pagination: { page: 3, type: 'PREV_NEXT' },
          },
        ],
      ]);

      expect(results).toEqual([
        {
          name: 'TEST_PREV_NEXT',
          pagination: { next: 1, type: 'PREV_NEXT' },
          payload: [],
          provider: 'Test',
          rawPayload: { success: true },
        },
        {
          name: 'TEST_PREV_NEXT',
          pagination: { next: 2, type: 'PREV_NEXT' },
          payload: [],
          provider: 'Test',
          rawPayload: { success: true },
        },
        {
          name: 'TEST_PREV_NEXT',
          pagination: { next: 3, type: 'PREV_NEXT' },
          payload: [],
          provider: 'Test',
          rawPayload: { success: true },
        },
        {
          name: 'TEST_PREV_NEXT',
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
        `no auth data in the state for 1`
      );
    });
  });
});
