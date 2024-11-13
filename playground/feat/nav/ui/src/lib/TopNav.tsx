import Link from 'next/link';
import { authStatusGet } from 'playground-feat-auth-data';
import { Button, LogoEasyBread } from 'playground-ui';
import { logoutAction } from 'playground-feat-auth-actions';

import { TopNavContainer } from './TopNavContainer';

export type TopNavProps = object;

export async function TopNav(props: TopNavProps) {
  const authStatus = await authStatusGet();

  if (!authStatus?.authorized) return null;

  return (
    <TopNavContainer>
      <div className={'w-full flex items-center'}>
        <LogoEasyBread />

        <div className={'flex flex-col justify-center'}>
          <span className={'text-lg font-bold leading-none tracking-normal'}>
            EasyBREAD
          </span>
          <span className={'text-sm font-light leading-tight tracking-widest'}>
            Playground
          </span>
        </div>
      </div>

      <div className={'flex w-full gap-4'}>
        <Link href={'/adapters'} className={'text-md font-bold'} prefetch>
          Adapters
        </Link>

        <Link href={'/people'} className={'text-md font-bold'} prefetch>
          People
        </Link>
      </div>

      <form className={'flex items-center'} action={logoutAction}>
        <span className={'mr-4'}>{authStatus.data.email}</span>
        <Button type={'submit'}>Logout</Button>
      </form>
    </TopNavContainer>
  );
}
