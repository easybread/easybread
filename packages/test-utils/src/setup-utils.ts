export const setExtendedTimeout = (): void => {
  jest.setTimeout(1000 * 60 * 5);
};
export const mockAxios = (): void => {
  jest.mock('axios');
};
