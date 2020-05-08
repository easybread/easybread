import React, { FC } from 'react';
import { FaImage } from 'react-icons/fa';
import Img from 'react-image';
import styled from 'styled-components/macro';

import { ElementSpinner } from '../../ui-kit/element-kit';

interface ImageViewProps {
  value: string;
}

export const ImageView: FC<ImageViewProps> = ({ value }) => {
  return (
    <StyledWrapper>
      <Img
        src={value}
        loader={<ElementSpinner />}
        unloader={<StyledFaImage size={18} />}
      />
    </StyledWrapper>
  );
};

const StyledFaImage = styled(FaImage)`
  margin-top: var(--gap-1);
`;

const StyledWrapper = styled.div`
  display: flex;
  align-self: center;
  max-width: 60px;
  max-height: 60px;
  color: var(--text-main-color-light);

  img {
    max-height: 100%;
    max-width: 100%;
  }
`;
