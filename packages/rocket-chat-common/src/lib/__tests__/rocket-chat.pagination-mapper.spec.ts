import { RocketChatPaginationMapper } from '../..';

const mapper = new RocketChatPaginationMapper();

it(`should map to remote params correctly`, () => {
  const result = mapper.toRemoteParams({
    type: 'SKIP_COUNT',
    skip: 2,
    count: 10,
  });
  expect(result).toEqual({
    count: 10,
    offset: 2,
  });
});
it(`should map data to output pagination correctly`, () => {
  const result = mapper.toOutputPagination({
    total: 30,
    offset: 2,
    count: 10,
  });
  expect(result).toEqual({
    count: 10,
    skip: 2,
    totalCount: 30,
    type: 'SKIP_COUNT',
  });
});
