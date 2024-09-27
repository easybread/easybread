import type { PropsWithChildren } from 'react';

export type CardProps = PropsWithChildren;
export function Card(props: CardProps) {
  return (
    <div className={'flex flex-col p-4 bg-white rounded-lg shadow-md'}>
      {props.children}
    </div>
  );
}
