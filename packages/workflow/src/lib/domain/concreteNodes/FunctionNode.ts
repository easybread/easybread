export class FunctionNode<
  TID extends string,
  TIn extends IOConstraint,
  TOut extends IOConstraint,
> extends WorkflowNode<TID, TIn, TOut, FiberPolicy, never> {
  run(context: NodeRunContext<this>): void {
    throw new Error('Method not implemented.');
  }
  fn: (input: TIn) => TOut | Promise<TOut>;

  get fiberPolicy(): FiberPolicy {
    return { type: FIBER_POLICY_TYPE.enum.PIPE };
  }

  constructor(id: TID, fn: (input: TIn) => TOut | Promise<TOut>) {
    super(id);
    this.fn = fn;
  }
}
