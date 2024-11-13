import { authTokenEncode } from '../lib/authTokenEncode';
import { authTokenVerify } from '../lib/authTokenVerify';

process.env.SHARED_JWT_SECRET = 'secret';

it(`should encode and decode the token`, async () => {
  const data = { foo: 'bar' };
  const token = await authTokenEncode({ data, expireTimeSec: 1000 });

  console.log(token);

  const decoded = await authTokenVerify(token);

  if (!expectNotNull(decoded)) return;

  expect(decoded.data).toEqual(data);
});

function expectNotNull<T>(value: T): value is Exclude<T, null> {
  if (value !== null) return true;
  expect(value).not.toBeNull();
  return false;
}
