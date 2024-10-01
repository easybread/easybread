import Image from 'next/image';

import type { PersonSchema } from '@easybread/schemas';

export type PeopleListItemPhotoProps = {
  person: PersonSchema;
};

function PhotoPlaceholder({ person }: { person: PersonSchema }) {
  const { givenName, familyName } = person;
  return (
    <div
      className={
        'w-16 min-w-16 h-16 bg-amber-600 rounded-full text-white flex justify-center items-center font-bold text-2xl border border-1 border-white shadow-md shadow-gray-300'
      }
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
      className={
        'w-16 h-16 min-w-16 rounded-full border border-1 border-white shadow-md shadow-gray-300'
      }
      src={person.image}
      alt={'photo'}
      width={64}
      height={64}
    />
  );
}
