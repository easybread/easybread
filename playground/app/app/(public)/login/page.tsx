import { LoginForm } from 'playground-feat-auth-ui';
import { LogoEasyBread } from 'playground-ui';

export default async function LoginPage() {
  return (
    <div className="mt-[10%] flex flex-col items-center justify-center gap-4 p-4">
      <div>
        <LogoEasyBread size={'lg'} />
      </div>
      <LoginForm />
    </div>
  );
}
