const axios = jest.requireActual('axios');

module.exports = {
  ...axios,
  request: jest.fn(() => Promise.resolve({ status: 500 })),
};
