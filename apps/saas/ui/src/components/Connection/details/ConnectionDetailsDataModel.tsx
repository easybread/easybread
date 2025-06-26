import type { DtoConnection } from 'saas-dto';

import { Separator } from '../../../shadcn/separator';

export function ConnectionDetailsDataModel({
  connection,
}: {
  connection: DtoConnection;
}) {
  return (
    <div className="flex flex-col gap-4">
      <DataModelHeading />
      {connection.isConnected ? <ConnectedView /> : <NotConnectedView />}
    </div>
  );
}

export function NotConnectedView() {
  return <div>NotConnectedView</div>;
}

export function ConnectedView() {
  return <div>ConnectedView</div>;
}
export function DataModelHeading() {
  return (
    <div className="flex w-full items-center gap-2 text-muted-foreground">
      <Separator className="flex-1" />
      <span>DATA MODEL</span>
      <Separator className="flex-1" />
    </div>
  );
}
