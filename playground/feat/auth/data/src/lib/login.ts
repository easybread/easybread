import {
  passwordVerify,
  userCreate,
  userFindByEmailUnsafe,
} from 'playground-feat-users-data';
import { authenticate } from './authenticate';

export type LoginProps = {
  setCookie: (
    name: string,
    value: string,
    expireTimeMs: number,
    domain: string
  ) => void;
  getCookie: (name: string) => string | undefined;
  email: string;
  password: string;
};

export async function login(props: LoginProps) {
  const { email, setCookie, password } = props;

  const user = await userFindByEmailUnsafe(email);

  if (!user) {
    const createdUser = await userCreate({ email, password });
    authenticate({ setCookie, data: { userId: `${createdUser._id}`, email } });
    return;
  }

  if (!passwordVerify(password, user.passwordHash)) {
    throw new Error('Invalid password');
  }

  authenticate({ setCookie, data: { userId: `${user._id}`, email } });
}
