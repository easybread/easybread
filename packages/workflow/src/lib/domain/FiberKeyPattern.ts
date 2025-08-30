import { KeyPattern } from './KeyPattern';

export class FiberKeyPattern extends KeyPattern.forPreset(
  'S(execId):P(fiberKey)',
) {
  static make = this.createFactoryMethod(this.PATTERN_TEMPLATE);
}
