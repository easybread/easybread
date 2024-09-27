import { LoginForm } from 'playground-feat-auth-ui';
import { LogoEasyBread } from 'playground-ui';

export default async function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-4 mt-[10%]">
      <div>
        <LogoEasyBread size={'lg'} />
      </div>
      <LoginForm />
    </div>
  );
}
