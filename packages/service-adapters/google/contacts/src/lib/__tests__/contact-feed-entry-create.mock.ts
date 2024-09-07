export const CONTACT_FEED_ENTRY_CREATE_MOCK = {
  version: '1.0',
  encoding: 'UTF-8',
  entry: {
    id: {
      $t: 'http://www.google.com/m8/feeds/contacts/testuser%40mail.com/base/79ec2071883179b9',
    },
    gd$etag: '"R3k4eTVSLyt7I2A9XB5UE0wKTgU."',
    updated: {
      $t: '2020-04-19T15:41:56.731Z',
    },
    app$edited: {
      xmlns$app: 'http://www.w3.org/2007/app',
      $t: '2020-04-19T15:41:56.731Z',
    },
    category: [
      {
        scheme: 'http://schemas.google.com/g/2005#kind',
        term: 'http://schemas.google.com/contact/2008#contact',
      },
    ],
    title: {
      $t: 'Test Contact',
    },
    link: [
      {
        rel: 'http://schemas.google.com/contacts/2008/rel#photo',
        type: 'image/*',
        href: 'https://www.google.com/m8/feeds/photos/media/testuser%40mail.com/79ec2071883179b9',
      },
      {
        rel: 'self',
        type: 'application/atom+xml',
        href: 'https://www.google.com/m8/feeds/contacts/testuser%40mail.com/full/79ec2071883179b9',
      },
      {
        rel: 'edit',
        type: 'application/atom+xml',
        href: 'https://www.google.com/m8/feeds/contacts/testuser%40mail.com/full/79ec2071883179b9',
      },
    ],
    gd$name: {
      gd$fullName: {
        $t: 'Test Contact',
      },
      gd$givenName: {
        $t: 'Test',
      },
      gd$familyName: {
        $t: 'Contact',
      },
    },
    gd$email: [
      {
        address: 'test@mail.com',
        primary: 'true',
        rel: 'http://schemas.google.com/g/2005#work',
      },
    ],
    gd$phoneNumber: [
      {
        rel: 'http://schemas.google.com/g/2005#home',
        primary: 'true',
        uri: 'tel:+7-965-444-22-11',
        $t: '+7 (965) 444 2211',
      },
    ],
    xmlns: 'http://www.w3.org/2005/Atom',
    xmlns$batch: 'http://schemas.google.com/gdata/batch',
    xmlns$gContact: 'http://schemas.google.com/contact/2008',
    xmlns$gd: 'http://schemas.google.com/g/2005',
  },
};
