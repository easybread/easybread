import type { PropsWithChildren } from 'react';

export type TopNavContainerProps = PropsWithChildren;

export function TopNavContainer(props: TopNavContainerProps) {
  return (
    <div className={'flex h-16 w-full items-center bg-white px-8 shadow'}>
      {props.children}
    </div>
  );
}
