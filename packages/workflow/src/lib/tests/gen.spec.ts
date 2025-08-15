interface PaginationParams {
  page: number;
  pageSize: number;
}

export function isParams(value: unknown): value is PaginationParams {
  return (
    typeof value === 'object' &&
    value !== null &&
    'page' in value &&
    'pageSize' in value &&
    typeof value.page === 'number' &&
    typeof value.pageSize === 'number'
  );
}

const DATA = Array.from({ length: 95 }, (_, i) => i);

export function* genericGenerator<T, P>(
  iterator: (params: P) => T,
  predicate: (params: P, results?: T) => boolean,
  initialParams: P,
): Generator<T, void, P> {
  let params = initialParams;
  let results: T | undefined;
  while (predicate(params, results)) {
    results = iterator(params);
    params = yield results;
  }
}

export function runPagination() {
  let page = 1;
  const gen = genericGenerator(
    params => {
      console.log('getPage', params);
      return DATA.slice(
        (params.page - 1) * params.pageSize,
        params.page * params.pageSize,
      );
    },

    (_, r) => (r ? r.length > 0 : true),

    { page, pageSize: 20 },
  );

  const iterationResults: number[] = [];

  let res = gen.next(undefined);
  while (!res.done) {
    iterationResults.push(...res.value);
    res = gen.next({ page: ++page, pageSize: 20 });
  }

  return iterationResults;
}

it('should work', async () => {
  const res = runPagination();
  expect(res).toEqual(DATA);
});
