import type { HttpTransportError } from '../transport/http';

import type { CommandAny, inferCommandError } from './command-util';

export type CommandError<TCommand extends CommandAny> = HttpTransportError<
  inferCommandError<TCommand>
>;
