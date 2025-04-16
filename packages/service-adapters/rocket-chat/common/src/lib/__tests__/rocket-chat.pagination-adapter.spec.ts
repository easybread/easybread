import { rocketChatPaginationAdapter } from '../..';

it(`should map to remote params correctly`, () => {
  const result = rocketChatPaginationAdapter.toExternalParams({
    type: 'OFFSET',
    offset: 2,
    limit: 10,
  });
  expect(result).toEqual({
    count: 10,
    offset: 2,
  });
});
it(`should map data to output pagination correctly`, () => {
  const result = rocketChatPaginationAdapter.toInternalData({
    total: 30,
    offset: 2,
    count: 10,
  });
  expect(result).toEqual({
    type: 'OFFSET',
    offset: 2,
    limit: 10,
    totalCount: 30,
  });
});
