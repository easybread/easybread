import { loginAction } from 'playground-feat-auth-actions';
import { Button, Input } from 'playground-ui';

export type LoginFormProps = object;

export async function LoginForm(props: LoginFormProps) {
  return (
    <form action={loginAction} className="flex min-w-72 flex-col gap-4">
      <Input type="text" name="email" placeholder={'email'} />
      <Input type="password" name="password" placeholder={'password'} />

      <Button type="submit" variant={'primary'}>
        Login or Register
      </Button>
    </form>
  );
}
