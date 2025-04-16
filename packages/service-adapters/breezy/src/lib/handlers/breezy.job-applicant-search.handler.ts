import { type CommandHandler } from '@easybread/core';

import type { BreezyAuthStrategy } from '../breezy.auth-strategy';
import { BREEZY_COMMAND_NAME } from '../breezy.command-name';
import type { BreezyJobApplicantSearchCommand } from '../commands';
import { breezyCandidateAdapter } from '../data-adapters';

import { candidateListAll } from './lib/candidate-list-all';

export const breezyJobApplicantSearchHandler: CommandHandler<
  BreezyJobApplicantSearchCommand,
  BreezyAuthStrategy
> = {
  name: BREEZY_COMMAND_NAME.HR_JOB_APPLICANT_SEARCH,
  async handle(input, context) {
    const candidates = await candidateListAll(context);

    return {
      success: true,
      breadId: input.breadId,
      payload: candidates.map(breezyCandidateAdapter.toInternal),
      pagination: { type: 'DISABLED' },
      rawPayload: candidates,
    };
  },
};
