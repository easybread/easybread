import { ServiceException } from '../exception';

export type CommandBaseInput = {
  readonly breadId: string;
};

export type CommandBaseOutput = {
  readonly breadId: string;
};

export type CommandBaseOutputSuccessful = CommandBaseOutput & {
  readonly success: true;
};

export type CommandBaseOutputFailed = CommandBaseOutput & {
  readonly success: false;
  readonly error: ServiceException;
};

export type CommandBaseOutputAny =
  | CommandBaseOutputSuccessful
  | CommandBaseOutputFailed;

export type CommandIO<
  TInput extends CommandBaseInput,
  TOutput extends CommandBaseOutputAny,
  TError,
> = {
  input: TInput;
  output: TOutput;
  error: TError;
};

export type CommandBase<
  TType extends string,
  TName extends string,
  TInput extends CommandBaseInput,
  TOutput extends CommandBaseOutputAny,
  TError,
> = {
  readonly name: TName;
  readonly type: TType;
  readonly $io: CommandIO<TInput, TOutput, TError>;
};
