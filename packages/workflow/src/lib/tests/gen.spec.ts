function* testGen() {
  const results: number[] = [];
  let current = 0;
  while (current < 5) {
    current = yield current + 1;
    results.push(current);
  }
  return results;
}

function* main() {
  return yield* testGen();
}

it('should work', async () => {
  const gen = main();

  const iterator = Iterator

  let val = gen.next();
  let iteration = 0;
  while (!val.done) {
    console.log(`iteration ${iteration++}! val: ${val.value}`);
    val = gen.next(val.value * 2);
  }

  expect(val).toEqual({ done: true, value: '' });
});
