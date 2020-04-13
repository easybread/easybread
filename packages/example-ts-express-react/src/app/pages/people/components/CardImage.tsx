import React, { FC } from 'react';
import styled from 'styled-components/macro';

interface CardImageProps {
  image?: string;
}

export const CardImage: FC<CardImageProps> = ({ image }) => {
  if (!image) return <StyledImagePlaceholder />;
  return <StyledImage src={image} />;
};

export const StyledImagePlaceholder = styled.div`
  flex-shrink: 0;
  background-color: var(--brand-teal-desaturated);
  width: 150px;
  height: 150px;
`;
export const StyledImage = styled.img`
  flex-shrink: 0;
  width: 150px;
  height: 150px;
`;
