import { version } from '..';

describe('Version', () => {
  it('Should be v1', () => {
    expect(version).toBe('v1');
  });
});
