import Image from 'next/image';

import type { PersonSchema } from '@easybread/schemas';

export type PeopleListItemPhotoProps = {
  person: PersonSchema;
};

function PhotoPlaceholder({ person }: { person: PersonSchema }) {
  const { givenName, familyName } = person;
  return (
    <div
      className={`flex size-16 min-w-16 items-center justify-center rounded-full border border-1
        border-white bg-amber-600 text-2xl font-bold text-white shadow-md
        shadow-gray-300`}
    >
      {givenName?.charAt(0)}
      {familyName?.charAt(0)}
    </div>
  );
}

export function PeopleListItemPhoto(props: PeopleListItemPhotoProps) {
  const { person } = props;

  if (!person.image) return <PhotoPlaceholder person={person} />;

  return (
    <Image
      className={`size-16 min-w-16 rounded-full border border-1 border-white shadow-md
        shadow-gray-300`}
      src={person.image}
      alt={'photo'}
      width={64}
      height={64}
    />
  );
}
