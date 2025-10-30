import type { PropsWithChildren } from 'react';

import { cn } from '../../../../lib/utils';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../../../shadcn/card';

export const NodeCard = ({
  children,
  selected,
  className,
}: {
  children: React.ReactNode;
  selected: boolean;
  className?: string;
}) => {
  return (
    <Card
      className={cn('min-w-64 gap-0 overflow-hidden p-0', className, {
        'shadow-xl': selected,
      })}
    >
      {children}
    </Card>
  );
};

export function NodeCardHeader(props: PropsWithChildren) {
  return (
    <CardHeader
      className="z-10 flex flex-row items-center justify-between p-2 px-4"
    >
      {props.children}
    </CardHeader>
  );
}

export function NodeCardTitle(props: PropsWithChildren) {
  return <CardTitle className="text-sm">{props.children}</CardTitle>;
}

export function NodeCardContent(
  props: PropsWithChildren<{ className?: string }>,
) {
  return (
    <CardContent className={cn(props.className)}>{props.children}</CardContent>
  );
}
