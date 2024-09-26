const actualAxios = jest.requireActual('axios');

export function createAxiosMock(module: NodeModule) {
  const mockAxios = {
    ...actualAxios,
    request: jest.fn(() => Promise.resolve({ status: 500 })),
  };

  mockAxios.default = mockAxios;

  module.exports = mockAxios;

  return mockAxios;
}
