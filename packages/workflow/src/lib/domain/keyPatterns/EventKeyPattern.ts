import { KeyPattern } from './KeyPattern';

export class EventKeyPattern extends KeyPattern.forPreset(
  'S(execId):S(eventName):P(nodeId):P(fiberKey)',
) {
  static make = this.createFactoryMethod(this.PATTERN_TEMPLATE);

  get execId() {
    return this.props.execId;
  }
}
