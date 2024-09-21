import type { PropsWithChildren } from 'react';

export type TopNavContainerProps = PropsWithChildren;

export function TopNavContainer(props: TopNavContainerProps) {
  return (
    <div className={'h-16 w-screen flex items-center shadow px-8 bg-white'}>
      {props.children}
    </div>
  );
}
