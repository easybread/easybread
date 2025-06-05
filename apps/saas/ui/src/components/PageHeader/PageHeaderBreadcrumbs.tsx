import { Fragment } from 'react';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../../shadcn/breadcrumb';

export function PageHeaderBreadcrumbs({ segments }: { segments: string[] }) {
  const pathSegments = [...segments];
  const pageSegment = pathSegments.pop();

  if (!segments.length) return <Breadcrumb />;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbSeparator className="" />
        {pathSegments.map((segment, index) => (
          <Fragment key={segment}>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink
                href={'/' + segments.slice(0, index + 1).join('/')}
              >
                {segment}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
          </Fragment>
        ))}

        <BreadcrumbItem>
          <BreadcrumbPage>{pageSegment}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
