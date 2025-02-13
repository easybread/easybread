import type { PropsWithChildren } from 'react';

export type PageContentProps = PropsWithChildren;

export function PageContent(props: PageContentProps) {
  return <div className="flex w-full flex-col px-8">{props.children}</div>;
}
