import { makeSuccessExit } from '../../Exit';
import { Intent } from '../../Intent';
import type { GetIO, IOConstraint, IOIn } from '../../helpers/IO';
import { Option } from '../../helpers/Option';
import type { Fiber } from '../Fiber';
import { makePipeFiberPolicy } from '../FiberPolicy';
import {
  type NodeAny,
  type OnCloseResultIntents,
  PipeNode,
  type inferNodeRunContext,
  type inferNodeRunReturn,
} from '../Node';
import { type NodeStatePolicyNone, noneStatePolicy } from '../NodeStatePolicy';

type GoToNodeTransform<TIn extends IOConstraint, TNode extends NodeAny> =
  TIn extends IOIn<GetIO<TNode>>
    ? undefined
    : (input: TIn) => IOIn<GetIO<TNode>>;

export class GoToNode<
  TId extends string,
  TIn extends IOConstraint,
  TNode extends NodeAny,
> extends PipeNode<
  TId,
  NodeStatePolicyNone,
  TIn,
  IOIn<GetIO<TNode>>,
  IOIn<GetIO<TNode>>
> {
  fiberPolicy = makePipeFiberPolicy();
  statePolicy = noneStatePolicy();

  private readonly targetNode: TNode;
  private readonly transform: (input: TIn) => IOIn<GetIO<TNode>>;

  constructor(id: TId, node: TNode, transform: GoToNodeTransform<TIn, TNode>) {
    super(id, []);
    this.targetNode = node;
    this.transform = (transform as any) ?? (input => input);
  }

  async run(context: inferNodeRunContext<this>): inferNodeRunReturn<this> {
    const input: TIn = await context.loadInputFiberData(context.inputFiber);
    const transformedInput: IOIn<GetIO<TNode>> = this.transform(input);

    return [
      Intent.closeFiber({
        fiber: context.runFiber,
        data: Option.some(transformedInput),
      }),
    ];
  }

  async onClose(fiber: Fiber): Promise<OnCloseResultIntents[]> {
    return [
      Intent.runNode({
        fiber,
        nodeId: this.targetNode.id,
      }),
      Intent.exit({
        fiber,
        exit: makeSuccessExit(),
      }),
      Intent.stopPropagation({
        reason: `${this.type} should does not propagate the close event.`,
      }),
    ];
  }
}
