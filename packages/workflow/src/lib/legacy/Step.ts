import { enumObject, enumSuiteObject } from '@space-architects/util-enum';

import {
  BreadEventBus,
  type EasyBreadClientAny,
  type inferCommandInput,
  type inferCommandOutput,
  type inferCommandOutputSuccessful,
  type inferEasyBreadClientCommandByName,
  type inferEasyBreadClientCommandName,
} from '@easybread/core';
import {
  type BreadDataMapDefinition,
  type BreadDataMapIOConstraint,
  BreadDataMapper,
} from '@easybread/data-mapper';

import { WorkflowStepExecutionError } from '../Error';
import type { WorkflowEventAny } from '../WorkflowEvent';
import type { IO, IOIn, IOOut } from '../helpers/IO';

import type { Executable } from './Executable';

export const STEP_TYPE = enumSuiteObject(
  enumObject([
    'MAP',
    'POPULATE',
    'CONDITIONAL',
    'PARALLEL',
    'FUNCTION',
    'COMMAND',
    'DATA_MAPPER',
    'VALUE',
  ]),
);

export type StepAny = Step<any, any, any>;

export abstract class Step<
    T extends typeof STEP_TYPE.$type,
    I extends BreadDataMapIOConstraint,
    O extends BreadDataMapIOConstraint,
  >
  extends BreadEventBus<WorkflowEventAny>
  implements Executable<IO<I, O>>
{
  static Command = <
    C extends EasyBreadClientAny,
    N extends inferEasyBreadClientCommandName<C>,
  >(
    name: string,
    client: C,
    commandName: N,
  ) => new StepCommand(name, client, commandName);

  static DataMapper = <TPrev extends StepAny, TNext extends StepAny>(
    name: string,
    mapDefinition: BreadDataMapDefinition<IOOut<TPrev>, IOIn<TNext>>,
  ) => new StepDataMapper(name, mapDefinition);

  static Function = <F extends (input: any) => any | Promise<any>>(
    name: string,
    f: F,
  ) => new StepFunction(name, f);

  static Value = <V extends BreadDataMapIOConstraint>(name: string, value: V) =>
    new StepValue(name, value);

  static Parallel = <
    TIn extends BreadDataMapIOConstraint,
    T extends Executable<IO<TIn, any>>[],
  >(
    name: string,
    executables: T,
  ) => new StepParallel(name, executables);

  //--------------------------------------------

  readonly _id: string;
  readonly _io = {} as IO<I, O>;
  readonly _name: string;
  readonly _f: (input: I) => Promise<O> | O;
  readonly _type: T;

  constructor(name: string, type: T, f: (input: I) => Promise<O> | O) {
    super();
    this._name = name.replaceAll(' ', '_');
    this._type = type;
    this._id = this.makeId();
    this._f = f;
  }

  async execute(input: I): Promise<O> {
    return await this._f(input);
  }

  protected makeId(): string {
    return `${this._type}/${this._name}`;
  }
}

export class StepValue<V extends BreadDataMapIOConstraint> extends Step<
  typeof STEP_TYPE.enum.VALUE,
  any,
  V
> {
  constructor(name: string, value: V) {
    super(name, STEP_TYPE.enum.VALUE, () => value);
  }
}

export class StepCommand<
  TClient extends EasyBreadClientAny,
  TCommandName extends inferEasyBreadClientCommandName<TClient>,
  TCommand extends inferEasyBreadClientCommandByName<
    TClient,
    TCommandName
  > = inferEasyBreadClientCommandByName<TClient, TCommandName>,
> extends Step<
  typeof STEP_TYPE.enum.COMMAND,
  inferCommandInput<TCommand>,
  inferCommandOutputSuccessful<TCommand>
> {
  readonly commandName: TCommandName;
  readonly client: TClient;

  constructor(name: string, client: TClient, commandName: TCommandName) {
    super(name, STEP_TYPE.enum.COMMAND, input =>
      client.invoke(commandName, input).then(this.handleOutput),
    );
    this.commandName = commandName;
    this.client = client;
  }

  handleOutput(
    output: inferCommandOutput<TCommand>,
  ): inferCommandOutputSuccessful<TCommand> {
    if (output.success === false) {
      // TODO: handle error channel
      throw new WorkflowStepExecutionError(
        this._id,
        'Command failed',
        output.error,
      );
    }

    // TODO: why is this not narrowing the type automatically?

    return output as inferCommandOutputSuccessful<TCommand>;
  }

  makeId(): string {
    return `${this.client.providerName}/${this.commandName}/${super.makeId()}`;
  }
}

export class StepDataMapper<
  TPrev extends StepAny,
  TNext extends StepAny,
> extends Step<typeof STEP_TYPE.enum.DATA_MAPPER, IOOut<TPrev>, IOIn<TNext>> {
  readonly mapDefinition: BreadDataMapDefinition<IOIn<TPrev>, IOIn<TNext>>;
  readonly mapper: BreadDataMapper<IOIn<TPrev>, IOIn<TNext>>;

  constructor(
    name: string,
    mapDefinition: BreadDataMapDefinition<IOIn<TPrev>, IOIn<TNext>>,
  ) {
    super(name, STEP_TYPE.enum.DATA_MAPPER, input => this.mapper.map(input));
    this.mapDefinition = mapDefinition;
    this.mapper = new BreadDataMapper(this.mapDefinition);
  }
}

type FnAny = (input: any) => any | Promise<any>;
type FnIn<F extends FnAny> = F extends (input: infer I) => any ? I : never;
type FnOut<F extends FnAny> = F extends (input: any) => infer O ? O : never;

export class StepFunction<F extends FnAny> extends Step<
  typeof STEP_TYPE.enum.FUNCTION,
  FnIn<F>,
  FnOut<F>
> {
  constructor(name: string, f: F) {
    super(name, STEP_TYPE.enum.FUNCTION, f);
  }
}

export class StepParallel<
  TIn extends BreadDataMapIOConstraint,
  T extends Executable<IO<TIn, any>>[],
> extends Step<
  typeof STEP_TYPE.enum.PARALLEL,
  TIn,
  { results: Awaited<IOOut<T[number]>>[] }
> {
  constructor(name: string, executables: T) {
    super(name, STEP_TYPE.enum.PARALLEL, async input => {
      const results = await Promise.all(
        executables.map(exe => exe.execute(input)),
      );
      return { results };
    });
  }
}
