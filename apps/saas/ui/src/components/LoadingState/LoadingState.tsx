import { cn } from '../../lib/utils';
import { Skeleton } from '../../shadcn/skeleton';

type LoadingStateVariant = 'default' | 'card' | 'table' | 'list' | 'form';

interface LoadingStateProps {
  variant?: LoadingStateVariant;
  className?: string;
  rows?: number;
  showAvatar?: boolean;
  showTitle?: boolean;
  showDescription?: boolean;
}

export function LoadingState({
  variant = 'default',
  className,
  rows = 3,
  showAvatar = false,
  showTitle = true,
  showDescription = true,
}: LoadingStateProps) {
  const renderContent = () => {
    switch (variant) {
      case 'card':
        return (
          <CardSkeleton
            showAvatar={showAvatar}
            showTitle={showTitle}
            showDescription={showDescription}
          />
        );

      case 'table':
        return <TableSkeleton rows={rows} />;

      case 'list':
        return <ListSkeleton rows={rows} showAvatar={showAvatar} />;

      case 'form':
        return <FormSkeleton rows={rows} />;

      default:
        return (
          <DefaultSkeleton
            rows={rows}
            showTitle={showTitle}
            showDescription={showDescription}
          />
        );
    }
  };

  return (
    <div className={cn('animate-pulse space-y-4', className)}>
      {renderContent()}
    </div>
  );
}

function DefaultSkeleton({
  rows,
  showTitle,
  showDescription,
}: {
  rows: number;
  showTitle: boolean;
  showDescription: boolean;
}) {
  return (
    <>
      {showTitle && <Skeleton className="h-8 w-3/4" />}
      {showDescription && <Skeleton className="h-4 w-1/2" />}
      <div className="space-y-3">
        {Array.from({ length: rows }, (_, i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
      </div>
    </>
  );
}

function CardSkeleton({
  showAvatar,
  showTitle,
  showDescription,
}: {
  showAvatar: boolean;
  showTitle: boolean;
  showDescription: boolean;
}) {
  return (
    <div className="space-y-4 rounded-lg border p-6">
      <div className="flex items-center space-x-4">
        {showAvatar && <Skeleton className="h-12 w-12 rounded-full" />}
        <div className="flex-1 space-y-2">
          {showTitle && <Skeleton className="h-4 w-3/4" />}
          {showDescription && <Skeleton className="h-4 w-1/2" />}
        </div>
      </div>

      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-3/5" />
      </div>

      <div className="flex space-x-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-16" />
      </div>
    </div>
  );
}

function TableSkeleton({ rows }: { rows: number }) {
  return (
    <div className="space-y-3">
      {/* Table header */}
      <div className="flex space-x-4">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/4" />
      </div>

      {/* Table rows */}
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex space-x-4">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      ))}
    </div>
  );
}

function ListSkeleton({
  rows,
  showAvatar,
}: {
  rows: number;
  showAvatar: boolean;
}) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="flex items-center space-x-4">
          {showAvatar && <Skeleton className="h-10 w-10 rounded-full" />}
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

function FormSkeleton({ rows }: { rows: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}

      <div className="flex space-x-2 pt-4">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-20" />
      </div>
    </div>
  );
}
