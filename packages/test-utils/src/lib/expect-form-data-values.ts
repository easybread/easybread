export function expectFormDataValues(
  formData: FormData,
  expectedData: Record<string, unknown>,
) {
  const fdData: Record<string, unknown> = {};

  formData.forEach((v, k) => (fdData[k] = v));

  expect(fdData).toEqual(expectedData);
}
