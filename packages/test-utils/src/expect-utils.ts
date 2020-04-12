// TODO: improve regexp
export const expectDate = expect.stringMatching(
  /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d*Z?/
);
