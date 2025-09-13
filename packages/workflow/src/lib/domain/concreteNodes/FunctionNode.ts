import { EXIT_STATUS } from '../../Exit';
import { Intent } from '../../Intent';
import type { IOConstraint } from '../../helpers/IO';
import { Option } from '../../helpers/Option';
import type { Fiber } from '../Fiber';
import { makePipeFiberPolicy } from '../FiberPolicy';
import {
  type OnCloseResultIntents,
  type OnExitResultIntents,
  PipeNode,
  type inferNodeRunContext,
  type inferNodeRunReturn,
} from '../Node';
import { type NodeStatePolicyNone, noneStatePolicy } from '../NodeStatePolicy';

type Fn<TIn extends IOConstraint, TOut extends IOConstraint> = (
  input: TIn,
) => TOut | Promise<TOut>;

type FnInput<T extends Fn<any, any>> = T extends (input: infer U) => any
  ? U
  : never;

type FnOutput<T extends Fn<any, any>> = T extends (input: any) => infer U
  ? U extends Promise<infer V>
    ? V
    : U
  : never;
export class FunctionNode<
  TName extends string,
  TFn extends Fn<any, any>,
> extends PipeNode<
  TName,
  NodeStatePolicyNone,
  FnInput<TFn>,
  FnOutput<TFn>,
  FnOutput<TFn>
> {
  fiberPolicy = makePipeFiberPolicy();
  statePolicy = noneStatePolicy();

  fn: TFn;

  constructor(id: TName, fn: TFn) {
    super(id, []);
    this.fn = fn;
  }

  /**
   * Reads the input fiber data, applies the function and closes the run fiber with the result of the function.
   */
  async run(context: inferNodeRunContext<this>): inferNodeRunReturn<this> {
    const inputData = await context.loadInputFiberData(context.inputFiber);
    const result = await this.fn(inputData);
    return [
      Intent.closeFiber({
        fiber: context.runFiber,
        data: Option.some(result),
      }),
    ];
  }

  /**
   * Just exit
   */
  async onClose(fiber: Fiber): Promise<OnCloseResultIntents[]> {
    return [Intent.exit({ exit: { status: EXIT_STATUS.enum.SUCCESS }, fiber })];
  }

  async onExit(fiber: Fiber): Promise<OnExitResultIntents[]> {
    throw new Error('Method not implemented.');
  }
}
