// eslint-disable-next-line no-console
console.info('mocked axios');

export default {
  request: jest.fn(() => Promise.resolve({ status: 500 }))
};
