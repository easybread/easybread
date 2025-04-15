import { breezyHrConnectAction } from 'playground-feat-adapters-actions';
import { Button, Icon, Input } from 'playground-ui';

export type AdapterConnectBreezyProps = {
  connectedAt?: Date;
};

export function AdapterConnectBreezy(props: AdapterConnectBreezyProps) {
  const { connectedAt } = props;
  const isConnected = connectedAt !== undefined;
  return isConnected ? (
    <div>connected</div>
  ) : (
    <form action={breezyHrConnectAction} className="flex flex-col">
      <div className={'flex flex-col gap-2'}>
        <Input type="email" name="email" placeholder="Email" />
        <Input type="password" name="password" placeholder={'Password'} />
        <Button type={'submit'} variant={'outline'} size={'md'}>
          <div className="mr-2 rounded-full bg-blue-400 p-1">
            <Icon iconName={'BREEZY'} size={'xxs'} className="text-white" />
          </div>
          <span>Connect</span>
        </Button>
      </div>
    </form>
  );
}
