import { PersonSchema } from '@easybread/schemas';
import { AxiosRequestConfig } from 'axios';

import { BreadAuthStrategy } from '../auth-strategy';
import {
  BreadCollectionOperation,
  BreadCollectionOperationInput,
  BreadCollectionOperationInputPagination,
  BreadCollectionOperationOutputWithPayload
} from '../operation';
import { BreadServiceAdapter } from '../service-adapter';
import { BreadStateAdapter } from '../state';
import { InMemoryStateAdapter } from '../state-adapters';
import { EasyBreadClient } from './easy-bread-client';

class TestAuthStrategy extends BreadAuthStrategy<{}> {
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

interface TestOperation extends BreadCollectionOperation<'TEST'> {
  input: BreadCollectionOperationInput<'TEST'>;
  output: BreadCollectionOperationOutputWithPayload<'TEST', PersonSchema[]>;
}

class TestAdapter extends BreadServiceAdapter<TestOperation, TestAuthStrategy> {
  provider = 'Test';
}

const state = new InMemoryStateAdapter();
const serviceAdapter = new TestAdapter();
const authStrategy = new TestAuthStrategy(state);

const client = new EasyBreadClient(state, serviceAdapter, authStrategy);

describe('invokeForAllPages', () => {
  beforeEach(() => {
    const totalCount = 378;
    jest.restoreAllMocks();
    jest.spyOn(client, 'invoke').mockImplementation(async input => {
      const { pagination, name } = input;
      return {
        pagination: {
          ...(pagination as BreadCollectionOperationInputPagination),
          totalCount
        },
        name,
        provider: 'Test',
        payload: [],
        rawPayload: { success: true }
      };
    });
  });

  it(`should return an async generator`, () => {
    const generator = client.allPages<TestOperation>({
      name: 'TEST',
      breadId: '1'
    });
    expect(generator.next).toEqual(expect.any(Function));
    expect(generator[Symbol.asyncIterator]).toBeDefined();
  });

  it(`should invoke operation and yield with the output for every page when iterated over`, async () => {
    const results: TestOperation['output'][] = [];

    for await (const result of client.allPages<TestOperation>({
      name: 'TEST',
      breadId: '1'
    })) {
      results.push(result);
    }

    expect((client.invoke as jest.Mock).mock.calls).toEqual([
      [
        {
          breadId: '1',
          name: 'TEST',
          pagination: { count: 50, skip: 0 }
        }
      ],
      [
        {
          breadId: '1',
          name: 'TEST',
          pagination: { count: 50, skip: 50 }
        }
      ],
      [
        {
          breadId: '1',
          name: 'TEST',
          pagination: { count: 50, skip: 100 }
        }
      ],
      [
        {
          breadId: '1',
          name: 'TEST',
          pagination: { count: 50, skip: 150 }
        }
      ],
      [
        {
          breadId: '1',
          name: 'TEST',
          pagination: { count: 50, skip: 200 }
        }
      ],
      [
        {
          breadId: '1',
          name: 'TEST',
          pagination: { count: 50, skip: 250 }
        }
      ],
      [
        {
          breadId: '1',
          name: 'TEST',
          pagination: { count: 50, skip: 300 }
        }
      ],
      [
        {
          breadId: '1',
          name: 'TEST',
          pagination: { count: 50, skip: 350 }
        }
      ]
    ]);

    expect(results).toEqual([
      {
        name: 'TEST',
        pagination: { count: 50, skip: 0, totalCount: 378 },
        payload: [],
        provider: 'Test',
        rawPayload: { success: true }
      },
      {
        name: 'TEST',
        pagination: { count: 50, skip: 50, totalCount: 378 },
        payload: [],
        provider: 'Test',
        rawPayload: { success: true }
      },
      {
        name: 'TEST',
        pagination: { count: 50, skip: 100, totalCount: 378 },
        payload: [],
        provider: 'Test',
        rawPayload: { success: true }
      },
      {
        name: 'TEST',
        pagination: { count: 50, skip: 150, totalCount: 378 },
        payload: [],
        provider: 'Test',
        rawPayload: { success: true }
      },
      {
        name: 'TEST',
        pagination: { count: 50, skip: 200, totalCount: 378 },
        payload: [],
        provider: 'Test',
        rawPayload: { success: true }
      },
      {
        name: 'TEST',
        pagination: { count: 50, skip: 250, totalCount: 378 },
        payload: [],
        provider: 'Test',
        rawPayload: { success: true }
      },
      {
        name: 'TEST',
        pagination: { count: 50, skip: 300, totalCount: 378 },
        payload: [],
        provider: 'Test',
        rawPayload: { success: true }
      },
      {
        name: 'TEST',
        pagination: { count: 50, skip: 350, totalCount: 378 },
        payload: [],
        provider: 'Test',
        rawPayload: { success: true }
      }
    ]);
  });
});
