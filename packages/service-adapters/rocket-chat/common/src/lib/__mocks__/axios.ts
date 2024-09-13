export default {
  request: jest.fn(() => Promise.resolve({ status: 500 })),
};
