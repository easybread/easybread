import React, { FC } from 'react';
import { Organization, Person } from 'schema-dts';

import { PersonInfo } from '../../../redux/features/people';
import { ListItemContainer } from '../../../ui-kit/lists-kit';
import { CardImage } from './CardImage';
import { CardMainInfo } from './CardMainInfo';

interface PersonCardProps {
  info: PersonInfo;
}

const COLORS = {
  google: '#efc655',
  bamboo: '#83c158'
};

export const PersonCard: FC<PersonCardProps> = ({ info }) => {
  const { provider } = info;

  const person = info.person as Person;

  if (typeof person === 'string') return null;

  const {
    email,
    givenName,
    familyName,
    image,
    telephone,
    jobTitle,
    worksFor,
    workLocation
  } = person;

  return (
    <ListItemContainer color={COLORS[provider]}>
      <CardImage image={image as string} />
      <CardMainInfo
        email={email as string}
        firstName={givenName as string}
        lastName={familyName as string}
        phone={telephone as string}
        jobTitle={jobTitle as string}
        worksFor={worksFor as Organization}
        workLocation={workLocation as string}
      />
    </ListItemContainer>
  );
};
