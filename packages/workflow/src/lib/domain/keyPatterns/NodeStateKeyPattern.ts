import { KeyPattern } from './KeyPattern';

/**
 * A key pattern for a node state.
 *
 * The stateKey is a universal key that is
 * - the fiber key for pipe nodes
 * - the scope key for fork and join nodes
 */
export class NodeStateKeyPattern extends KeyPattern.forPreset(
  'S(execId):P(nodeId):P(stateKey)',
) {
  static make = this.createFactoryMethod(this.PATTERN_TEMPLATE);

  get execId() {
    return this.props.execId;
  }

  get nodeId() {
    return this.props.nodeId;
  }

  get stateKey() {
    return this.props.stateKey;
  }
}
