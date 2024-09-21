import { Button, Input } from 'playground-ui';
import { loginAction } from './loginAction';

export type LoginFormProps = {
  //
};

export function LoginForm(props: LoginFormProps) {
  return (
    <form action={loginAction} className="flex flex-col gap-4 min-w-72">
      <Input type="text" name="email" placeholder={'email'} />
      <Input type="password" name="password" placeholder={'password'} />

      <Button type="submit" variant={'primary'}>
        Login or Register
      </Button>
    </form>
  );
}
