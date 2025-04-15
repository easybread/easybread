import { BreadEvent } from '../../event-bus/bread.event';

export class AuthenticationLostEvent extends BreadEvent<{
  breadId: string;
  provider: string;
  error: unknown;
}> {
  static readonly eventName = 'AUTHENTICATION_LOST';

  readonly name = AuthenticationLostEvent.eventName;
}
