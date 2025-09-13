import { Intent } from '../../Intent';
import type { IOConstraintArray } from '../../helpers/IO';
import { Option } from '../../helpers/Option';
import { makeForkFiberPolicy } from '../FiberPolicy';
import {
  ForkNode,
  type OnCloseResultIntents,
  type OnExitResultIntents,
  type inferNodeEventHandlerContext,
  type inferNodeRunContext,
  type inferNodeRunReturn,
} from '../Node';
import { type NodeStatePolicyNone, noneStatePolicy } from '../NodeStatePolicy';

export class EnumNode<
  TName extends string,
  TIn extends IOConstraintArray,
> extends ForkNode<TName, NodeStatePolicyNone, TIn, TIn[number], TIn[number]> {
  fiberPolicy = makeForkFiberPolicy(1);
  statePolicy = noneStatePolicy();

  async run(context: inferNodeRunContext<this>): inferNodeRunReturn<this> {
    const [runFiber] = context.runFibers;
    const inputData = await context.loadInputFiberData(context.inputFiber);

    if (runFiber.ordinality === 0) {
      const firstItem = inputData.shift();

      if (firstItem == null) {
        throw new Error('First item is null');
      }

      return [
        Intent.closeFiber({ fiber: runFiber, data: Option.some(firstItem) }),
        ...inputData.map(_ =>
          Intent.runNode({ fiber: context.inputFiber, nodeId: this.id }),
        ),
      ];
    }

    return [
      Intent.closeFiber({
        fiber: runFiber,
        data: Option.some(inputData[runFiber.ordinality]),
      }),
    ];
  }

  async onClose(
    context: inferNodeEventHandlerContext<this>,
  ): Promise<OnCloseResultIntents[]> {
    return [];
  }

  async onExit(
    context: inferNodeEventHandlerContext<this>,
  ): Promise<OnExitResultIntents[]> {
    return [];
  }
}

/* 
There is a different approach to creating the fibers.
instead of opening the fiber when running the node, we can open the fiber when scheduling the node run.

(processing the run node intent)
  inputFiber = intent.fiber;
  targetNode = graph.getNode(intent.nodeId)
  
  runFibers = await fiberStore.openForkFibers(inputFiber, targetNode)
  return runFibers.map fiber => NodeScheduledEvent(fiber.execId, fiber.key, fiber.nodeId, targetNode.id)

this way for every scheduled node run we will have an open fiber. Always. 
That means, we don't need to check the queue size to know if there are any pending tasks.

runNode
  node = graph.getNode(event.nodeId)
  runFiber = fiberStore.getFiber(event.execId, event.fiberKey)
  inputFiber = fiberStore.resolveInputFiber(runFiber)

  checkBackPressure(inputFiber, node)

  context = factory.createRunContext(node, inputFiber, runFiber)
  intents = node.run(context)
  events = processor.process(intents)
  eventStore.writeMany(events)
*/
