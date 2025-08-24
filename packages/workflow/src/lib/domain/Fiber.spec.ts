import { FIBER_STATUS, Fiber } from './Fiber';
import { FIBER_POLICY_TYPE } from './FiberPolicy';

const EXEC_ID = 'ex1';

describe('static fromJSON()', () => {
  it('create a fiber from a valid JSON', () => {
    const fiber = Fiber.fromJSON({
      execId: EXEC_ID,
      dataRef: 'data-ref-1',
      segments: ['r', 'r/enum'],
      key: '-/0',
      status: FIBER_STATUS.enum.CLOSED,
      policyType: FIBER_POLICY_TYPE.enum.FORK,
    });

    expect(fiber.execId).toEqual(EXEC_ID);
    expect(fiber.key.toString()).toBe('-/0');
    expect(fiber.segments).toEqual(['r', 'r/enum']);
    expect(fiber.dataRef).toEqual('data-ref-1');
    expect(fiber.status).toEqual(FIBER_STATUS.enum.CLOSED);
    expect(fiber.length).toEqual(2);
    expect(fiber.policyType).toEqual(FIBER_POLICY_TYPE.enum.FORK);
  });
});

describe('static pkEncode()', () => {
  it('should encode the fiber key', () => {
    expect(Fiber.pkEncode({ execId: EXEC_ID, key: '-/0' })).toBe(
      `${EXEC_ID}:-/0`,
    );
  });
});

describe('static pkDecode()', () => {
  it('should decode the fiber key', () => {
    expect(Fiber.pkDecode(`${EXEC_ID}:-/0`)).toEqual({
      execId: EXEC_ID,
      key: '-/0',
    });
  });
});

describe('toJSON()', () => {
  it('should return the JSON representation of the fiber', () => {
    const fiber = Fiber.fromJSON({
      execId: EXEC_ID,
      dataRef: 'data-ref-1',
      segments: ['r', 'r/enum'],
      key: '-/0',
      status: FIBER_STATUS.enum.CLOSED,
      policyType: FIBER_POLICY_TYPE.enum.FORK,
    });

    expect(fiber.toJSON()).toEqual({
      execId: EXEC_ID,
      dataRef: 'data-ref-1',
      segments: ['r', 'r/enum'],
      key: '-/0',
      status: 'CLOSED',
      policyType: 'FORK',
    });
  });
});

describe('pipe()', () => {
  it('should create a new open fiber with the given nodeId', () => {
    const fiber = Fiber.fromJSON({
      execId: EXEC_ID,
      dataRef: 'data-ref-1',
      segments: ['r', 'r/enum'],
      key: '-/0',
      status: FIBER_STATUS.enum.CLOSED,
      policyType: FIBER_POLICY_TYPE.enum.FORK,
    });

    const newFiber = fiber.pipe('r/p');

    expect(newFiber.execId).toEqual(EXEC_ID);
    expect(newFiber.key.toString()).toBe('-/0/-');
    expect(newFiber.segments).toEqual(['r', 'r/enum', 'r/p']);
    expect(newFiber.dataRef).toBe(null);
    expect(newFiber.status).toEqual(FIBER_STATUS.enum.OPEN);
    expect(newFiber.policyType).toEqual(FIBER_POLICY_TYPE.enum.PIPE);
  });

  it('should throw an error if the fiber is not closed', () => {
    const fiber = Fiber.fromJSON({
      execId: EXEC_ID,
      dataRef: 'data-ref-1',
      segments: ['r', 'r/enum'],
      key: '-/0',
      status: FIBER_STATUS.enum.OPEN,
      policyType: FIBER_POLICY_TYPE.enum.PIPE,
    });

    expect(() => fiber.pipe('r/p')).toThrow(
      `Fiber ${EXEC_ID}:-/0 is not closed`,
    );
  });
});

describe('fork()', () => {
  it('should create a new open fiber with the given nodeId and ordinality', () => {
    const fiber = Fiber.fromJSON({
      execId: EXEC_ID,
      dataRef: 'data-ref-1',
      segments: ['r', 'r/enum'],
      key: '-/0',
      status: FIBER_STATUS.enum.CLOSED,
      policyType: FIBER_POLICY_TYPE.enum.FORK,
    });

    const newFiber = fiber.fork('r/p', 0);

    expect(newFiber.execId).toEqual(EXEC_ID);
    expect(newFiber.key.toString()).toBe('-/0/0');
    expect(newFiber.segments).toEqual(['r', 'r/enum', 'r/p']);
    expect(newFiber.dataRef).toBe(null);
    expect(newFiber.status).toEqual(FIBER_STATUS.enum.OPEN);
    expect(newFiber.policyType).toEqual(FIBER_POLICY_TYPE.enum.FORK);
  });

  it('should create a new open fiber with the given nodeId and ordinality when the last segment is the same as the nodeId', () => {
    const fiber = Fiber.fromJSON({
      execId: EXEC_ID,
      dataRef: 'data-ref-1',
      segments: ['r', 'r/enum', 'r/p'],
      key: '-/0/0',
      status: FIBER_STATUS.enum.CLOSED,
      policyType: FIBER_POLICY_TYPE.enum.FORK,
    });

    const newFiber = fiber.fork('r/p', 1);

    expect(newFiber.execId).toEqual(EXEC_ID);
    expect(newFiber.key.toString()).toBe('-/0/1');
    expect(newFiber.segments).toEqual(['r', 'r/enum', 'r/p', 'r/p']);
    expect(newFiber.status).toEqual(FIBER_STATUS.enum.OPEN);
    expect(newFiber.policyType).toEqual(FIBER_POLICY_TYPE.enum.FORK);
  });

  it('should throw if the given ordinality is equal to the last key segment', () => {
    const fiber = Fiber.fromJSON({
      execId: EXEC_ID,
      dataRef: 'data-ref-1',
      segments: ['r', 'r/enum', 'r/p'],
      key: '-/0/0',
      status: FIBER_STATUS.enum.CLOSED,
      policyType: FIBER_POLICY_TYPE.enum.FORK,
    });

    expect(() => fiber.fork('r/p', 0)).toThrow(
      'FiberKey: Cannot fork on the same segment',
    );
  });

  it('should throw an error if the fiber is not closed', () => {
    const fiber = Fiber.fromJSON({
      execId: EXEC_ID,
      dataRef: 'data-ref-1',
      segments: ['r', 'r/enum'],
      key: '-/0',
      status: FIBER_STATUS.enum.OPEN,
      policyType: FIBER_POLICY_TYPE.enum.FORK,
    });

    expect(() => fiber.fork('r/p', 0)).toThrow(
      `Fiber ${EXEC_ID}:-/0 is not closed`,
    );
  });
});

describe('join()', () => {
  it('should create a new open fiber with the given nodeId and ordinality', () => {
    const fiber = Fiber.fromJSON({
      execId: EXEC_ID,
      dataRef: 'data-ref-1',
      segments: ['r', 'r/enum'],
      key: '-/0',
      status: FIBER_STATUS.enum.CLOSED,
      policyType: FIBER_POLICY_TYPE.enum.FORK,
    });

    const newFiber = fiber.join('r/batch', 0);

    expect(newFiber.execId).toEqual(EXEC_ID);
    expect(newFiber.key.toString()).toBe('-/0/0');
    expect(newFiber.segments).toEqual(['r', 'r/enum', 'r/batch']);
    expect(newFiber.dataRef).toBe(null);
    expect(newFiber.status).toEqual(FIBER_STATUS.enum.OPEN);
    expect(newFiber.policyType).toEqual(FIBER_POLICY_TYPE.enum.JOIN);
  });

  it('should throw an error if the fiber is not closed', () => {
    const fiber = Fiber.fromJSON({
      execId: EXEC_ID,
      dataRef: 'data-ref-1',
      segments: ['r', 'r/enum'],
      key: '-/0',
      status: FIBER_STATUS.enum.OPEN,
      policyType: FIBER_POLICY_TYPE.enum.FORK,
    });

    expect(() => fiber.join('r/batch', 0)).toThrow(
      `Fiber ${EXEC_ID}:-/0 is not closed`,
    );
  });
});

describe('scopePrefixKey()', () => {
  it('should create expected scope key for a fork fiber when the anchor is not in segments', async () => {
    const fiber = Fiber.fromJSON({
      execId: EXEC_ID,
      dataRef: 'data-ref-1',
      segments: ['r', 'r/enum'],
      key: '-/0',
      status: FIBER_STATUS.enum.OPEN,
      policyType: FIBER_POLICY_TYPE.enum.FORK,
    });

    expect(
      fiber.scopePrefixKey('r/p', {
        type: FIBER_POLICY_TYPE.enum.FORK,
        forkCount: 1,
      }),
    ).toBe('-/0');
  });

  it('should create expected scope key for a fork fiber when the anchor is in segments', async () => {
    const fiber = Fiber.fromJSON({
      execId: EXEC_ID,
      dataRef: 'data-ref-1',
      segments: ['r', 'r/enum', 'r/p'],
      key: '-/0/0',
      status: FIBER_STATUS.enum.OPEN,
      policyType: FIBER_POLICY_TYPE.enum.FORK,
    });

    expect(
      fiber.scopePrefixKey('r/p', {
        type: FIBER_POLICY_TYPE.enum.FORK,
        forkCount: 1,
      }),
    ).toBe('-/0');
  });

  it('should create expected scope key for a join fiber when the anchor is in segments', async () => {
    const fiber = Fiber.fromJSON({
      execId: EXEC_ID,
      dataRef: 'data-ref-1',
      segments: ['r', 'r/enum', 'r/p', 'r/c/fn'],
      key: '-/0/0/-',
      status: FIBER_STATUS.enum.OPEN,
      policyType: FIBER_POLICY_TYPE.enum.PIPE,
    });

    expect(
      fiber.scopePrefixKey('r/enum', {
        type: FIBER_POLICY_TYPE.enum.JOIN,
        anchor: 'r/enum',
        limit: 10,
      }),
    ).toEqual('-/0');
  });

  it('should throw an error for a join fiber when the anchor is NOT in segements', () => {
    const fiber = Fiber.fromJSON({
      execId: EXEC_ID,
      dataRef: 'data-ref-1',
      segments: ['r', 'r/enum', 'r/p', 'r/c/fn'],
      key: '-/0/0/-',
      status: FIBER_STATUS.enum.OPEN,
      policyType: FIBER_POLICY_TYPE.enum.PIPE,
    });

    expect(() =>
      fiber.scopePrefixKey('r/c', {
        type: FIBER_POLICY_TYPE.enum.JOIN,
        anchor: 'r/c',
        limit: 10,
      }),
    ).toThrow(
      'Anchor node not found in fiber, but required to create the join scope prefix key',
    );
  });
});

describe('scopeKey()', () => {
  it('should create expected scope key for a fork fiber when the anchor is not in segments', async () => {
    const fiber = Fiber.fromJSON({
      execId: EXEC_ID,
      dataRef: 'data-ref-1',
      segments: ['r', 'r/enum'],
      key: '-/0',
      status: FIBER_STATUS.enum.OPEN,
      policyType: FIBER_POLICY_TYPE.enum.FORK,
    });

    expect(
      fiber.scopeKey('r/p', {
        type: FIBER_POLICY_TYPE.enum.FORK,
        forkCount: 1,
      }),
    ).toBe('-/0/~');
  });

  it('should create expected scope key for a fork fiber when the anchor is in segments', async () => {
    const fiber = Fiber.fromJSON({
      execId: EXEC_ID,
      dataRef: 'data-ref-1',
      segments: ['r', 'r/enum', 'r/p'],
      key: '-/0/0',
      status: FIBER_STATUS.enum.OPEN,
      policyType: FIBER_POLICY_TYPE.enum.FORK,
    });

    expect(
      fiber.scopeKey('r/p', {
        type: FIBER_POLICY_TYPE.enum.FORK,
        forkCount: 1,
      }),
    ).toBe('-/0/~');
  });

  it('should create expected scope key for a join fiber when the anchor is in segments', async () => {
    const fiber = Fiber.fromJSON({
      execId: EXEC_ID,
      dataRef: 'data-ref-1',
      segments: ['r', 'r/enum', 'r/pipe', 'r/batch'],
      key: '-/0/-/1',
      status: FIBER_STATUS.enum.OPEN,
      policyType: FIBER_POLICY_TYPE.enum.JOIN,
    });

    expect(
      fiber.scopeKey(
        'r/enum',
        {
          type: FIBER_POLICY_TYPE.enum.JOIN,
          anchor: 'r/enum',
          limit: 10,
        },
        1,
      ),
    ).toBe('-/0/~/1');
  });

  it('should create expected scope key for a pipe fiber and join policy when the anchor is in segments', async () => {
    const fiber = Fiber.fromJSON({
      execId: EXEC_ID,
      dataRef: 'data-ref-1',
      segments: ['r', 'r/enum', 'r/pipe'],
      key: '-/0/-',
      status: FIBER_STATUS.enum.OPEN,
      policyType: FIBER_POLICY_TYPE.enum.PIPE,
    });

    expect(
      fiber.scopeKey(
        'r/enum',
        {
          type: FIBER_POLICY_TYPE.enum.JOIN,
          anchor: 'r/enum',
          limit: 10,
        },
        1,
      ),
    ).toBe('-/0/~/1');
  });
});

describe('keyPrefixUsingSegmentPredicate()', () => {
  it('should create expected key prefix', async () => {
    const fiber = Fiber.fromJSON({
      execId: EXEC_ID,
      dataRef: 'data-ref-1',
      segments: ['r', 'r/enum', 'r/pipe', 'r/batch'],
      key: '-/1/-/2',
      status: FIBER_STATUS.enum.OPEN,
      policyType: FIBER_POLICY_TYPE.enum.JOIN,
    });

    expect(
      fiber.keyPrefixByLastMatchingNodeId(nodeId => nodeId === 'r/batch'),
    ).toBe('-/1/-/2');

    expect(
      fiber.keyPrefixByLastMatchingNodeId(nodeId => nodeId === 'r/enum'),
    ).toBe('-/1');

    expect(fiber.keyPrefixByLastMatchingNodeId(_ => false)).toBe('');
  });
});
