'use client';

import { useSelectedLayoutSegments } from 'next/navigation';

import { SidebarTrigger } from '../../shadcn/sidebar';

import { PageHeaderBreadcrumbs } from './PageHeaderBreadcrumbs';

export function PageHeader() {
  const segments = useSelectedLayoutSegments();
  return (
    <header
      className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear
        group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12"
    >
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />

        <PageHeaderBreadcrumbs segments={segments} />
      </div>
    </header>
  );
}
