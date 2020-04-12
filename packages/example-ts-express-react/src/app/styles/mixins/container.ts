import { css } from 'styled-components/macro';

import { BREAKPOINTS } from '../theme';

export const container = css`
  width: 100%;
  @media (min-width: ${BREAKPOINTS.lg}) {
    max-width: var(--width-lg);
  }
  @media (min-width: ${BREAKPOINTS.md}) {
    max-width: var(--screen-md);
  }
  @media (min-width: ${BREAKPOINTS.sm}) {
    max-width: var(--screen-sm);
  }
`;
