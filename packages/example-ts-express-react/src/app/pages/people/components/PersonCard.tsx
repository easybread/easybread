import React, { FC } from 'react';

import { ListItemContainer } from '../../../ui-kit/lists-kit';
import { CardImage } from './CardImage';
import { PersonInfo } from './PersonInfo';
import { CardMainInfo } from './CardMainInfo';

interface PersonCardProps {
  info: PersonInfo;
}

const COLORS = {
  google: '#d15a4f',
  'bamboo-hr': '#68ac38'
};

export const PersonCard: FC<PersonCardProps> = ({ info }) => {
  const { person, provider } = info;

  if (typeof person === 'string') return null;

  const { email, givenName, familyName, image, telephone } = person;

  // eslint-disable-next-line no-console
  return (
    <ListItemContainer color={COLORS[provider]}>
      <CardImage image={image as string} />
      <CardMainInfo
        email={email as string}
        firstName={givenName as string}
        lastName={familyName as string}
        phone={telephone as string}
      />
    </ListItemContainer>
  );
};
