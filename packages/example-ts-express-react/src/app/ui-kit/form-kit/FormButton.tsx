import styled from 'styled-components/macro';

import { w2of3 } from '../../styles/mixins';
import { BREAKPOINTS } from '../../styles/theme';
import { ElementButton } from '../element-kit';

export const FormButton = styled(ElementButton)`
  @media (min-width: ${BREAKPOINTS.sm}) {
    ${w2of3}
  }
`;
