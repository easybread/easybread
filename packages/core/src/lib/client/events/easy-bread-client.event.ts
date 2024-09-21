import type { BreadAuthStrategyEvent } from '../../auth-strategy';

// there will be more events in the future.
// For now, easy bread client is only forwarding auth strategy events.
export type EasyBreadClientEvent = BreadAuthStrategyEvent;
