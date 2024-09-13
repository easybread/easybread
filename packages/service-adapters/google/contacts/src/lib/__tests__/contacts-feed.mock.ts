export const CONTACTS_FEED_MOCK = {
  version: '1.0',
  encoding: 'UTF-8',
  feed: {
    xmlns: 'http://www.w3.org/2005/Atom',
    xmlns$openSearch: 'http://a9.com/-/spec/opensearch/1.1/',
    xmlns$batch: 'http://schemas.google.com/gdata/batch',
    xmlns$gd: 'http://schemas.google.com/g/2005',
    xmlns$gContact: 'http://schemas.google.com/contact/2008',
    gd$etag: '"EFQQSgpAASlgKno_Wg.."',
    id: {
      $t: 'testuser@gmail.com',
    },
    updated: {
      $t: '2020-03-27T19:18:27.075Z',
    },
    category: [
      {
        scheme: 'http://schemas.google.com/g/2005#kind',
        term: 'http://schemas.google.com/contact/2008#contact',
      },
    ],
    title: {
      $t: "Test User's Contacts",
    },
    link: [
      {
        rel: 'alternate',
        type: 'text/html',
        href: 'http://www.google.com/',
      },
      {
        rel: 'http://schemas.google.com/g/2005#feed',
        type: 'application/atom+xml',
        href: 'https://www.google.com/m8/feeds/contacts/testuser%40gmail.com/full',
      },
      {
        rel: 'http://schemas.google.com/g/2005#post',
        type: 'application/atom+xml',
        href: 'https://www.google.com/m8/feeds/contacts/testuser%40gmail.com/full',
      },
      {
        rel: 'http://schemas.google.com/g/2005#batch',
        type: 'application/atom+xml',
        href: 'https://www.google.com/m8/feeds/contacts/testuser%40gmail.com/full/batch',
      },
      {
        rel: 'self',
        type: 'application/atom+xml',
        href: 'https://www.google.com/m8/feeds/contacts/testuser%40gmail.com/full?alt=json&max-results=25',
      },
      {
        rel: 'next',
        type: 'application/atom+xml',
        href: 'https://www.google.com/m8/feeds/contacts/testuser%40gmail.com/full?alt=json&start-index=26&max-results=25',
      },
    ],
    author: [
      {
        email: {
          $t: 'testuser@gmail.com',
        },
        name: {
          $t: 'Test User',
        },
      },
    ],
    generator: {
      $t: 'Contacts',
      uri: 'http://www.google.com/m8/feeds',
      version: '1.0',
    },
    openSearch$totalResults: {
      $t: '374',
    },
    openSearch$startIndex: {
      $t: '1',
    },
    openSearch$itemsPerPage: {
      $t: '25',
    },
    entry: [
      {
        id: {
          $t: 'http://www.google.com/m8/feeds/contacts/testuser%40gmail.com/base/cce0f8ee06147',
        },
        gd$etag: '"SH8_fjVSLit7I2A9Wh9VGE8DRwA."',
        updated: {
          $t: '2014-04-07T00:04:09.146Z',
        },
        app$edited: {
          xmlns$app: 'http://www.w3.org/2007/app',
          $t: '2014-04-07T00:04:09.146Z',
        },
        category: [
          {
            scheme: 'http://schemas.google.com/g/2005#kind',
            term: 'http://schemas.google.com/contact/2008#contact',
          },
        ],
        title: {
          $t: 'Contact One',
        },
        gd$name: {
          gd$fullName: {
            $t: 'Contact One',
          },
          gd$givenName: {
            $t: 'Contact',
          },
          gd$familyName: {
            $t: 'One',
          },
        },
        link: [
          {
            rel: 'http://schemas.google.com/contacts/2008/rel#photo',
            type: 'image/*',
            href: 'https://www.google.com/m8/feeds/photos/media/testuser%40gmail.com/cce0f8ee06147',
          },
          {
            rel: 'self',
            type: 'application/atom+xml',
            href: 'https://www.google.com/m8/feeds/contacts/testuser%40gmail.com/full/cce0f8ee06147',
          },
          {
            rel: 'edit',
            type: 'application/atom+xml',
            href: 'https://www.google.com/m8/feeds/contacts/testuser%40gmail.com/full/cce0f8ee06147',
          },
        ],
        gd$email: [
          {
            address: 'apeeling50@gmail.com',
            primary: 'true',
            rel: 'http://schemas.google.com/g/2005#other',
          },
        ],
      },
      {
        id: {
          $t: 'http://www.google.com/m8/feeds/contacts/testuser%40gmail.com/base/f98b6c09ec5b23',
        },
        gd$etag: '"QH85fTVSLit7I2A9XR9QE00IRA0."',
        updated: {
          $t: '2017-04-27T14:13:11.125Z',
        },
        app$edited: {
          xmlns$app: 'http://www.w3.org/2007/app',
          $t: '2017-04-27T14:13:11.125Z',
        },
        category: [
          {
            scheme: 'http://schemas.google.com/g/2005#kind',
            term: 'http://schemas.google.com/contact/2008#contact',
          },
        ],
        title: {
          $t: 'Contact Two',
        },
        link: [
          {
            rel: 'http://schemas.google.com/contacts/2008/rel#photo',
            type: 'image/*',
            href: 'https://www.google.com/m8/feeds/photos/media/testuser%40gmail.com/f98b6c09ec5b23',
            gd$etag: '"Xm1WLmoZfCt7I2BHBRMwfz5XTwIwHkQFMzc."',
          },
          {
            rel: 'self',
            type: 'application/atom+xml',
            href: 'https://www.google.com/m8/feeds/contacts/testuser%40gmail.com/full/f98b6c09ec5b23',
          },
          {
            rel: 'edit',
            type: 'application/atom+xml',
            href: 'https://www.google.com/m8/feeds/contacts/testuser%40gmail.com/full/f98b6c09ec5b23',
          },
        ],
        gd$name: {
          gd$fullName: {
            $t: 'Contact Two',
          },
          gd$givenName: {
            $t: 'Contact',
          },
          gd$familyName: {
            $t: 'Two',
          },
        },
        gd$email: [
          {
            address: 'two@mail.com',
            primary: 'true',
            rel: 'http://schemas.google.com/g/2005#other',
          },
        ],
      },
      {
        id: {
          $t: 'http://www.google.com/m8/feeds/contacts/testuser%40gmail.com/base/116021795164d6c',
        },
        gd$etag: '"R34_ejVSLit7I2A9XRBXFkQCRQY."',
        updated: {
          $t: '2016-05-31T12:37:06.042Z',
        },
        app$edited: {
          xmlns$app: 'http://www.w3.org/2007/app',
          $t: '2016-05-31T12:37:06.042Z',
        },
        category: [
          {
            scheme: 'http://schemas.google.com/g/2005#kind',
            term: 'http://schemas.google.com/contact/2008#contact',
          },
        ],
        title: {
          $t: 'Contact Three',
        },
        link: [
          {
            rel: 'http://schemas.google.com/contacts/2008/rel#photo',
            type: 'image/*',
            href: 'https://www.google.com/m8/feeds/photos/media/testuser%40gmail.com/116021795164d6c',
          },
          {
            rel: 'self',
            type: 'application/atom+xml',
            href: 'https://www.google.com/m8/feeds/contacts/testuser%40gmail.com/full/116021795164d6c',
          },
          {
            rel: 'edit',
            type: 'application/atom+xml',
            href: 'https://www.google.com/m8/feeds/contacts/testuser%40gmail.com/full/116021795164d6c',
          },
        ],
        gd$name: {
          gd$fullName: {
            $t: 'Contact Three',
          },
          gd$givenName: {
            $t: 'Contact',
          },
          gd$familyName: {
            $t: 'Three',
          },
        },
        gd$organization: [
          {
            rel: 'http://schemas.google.com/g/2005#other',
            gd$orgName: {
              $t: 'Test Org',
            },
          },
        ],
        gd$email: [
          {
            address: 'three@mail.com',
            primary: 'true',
            rel: 'http://schemas.google.com/g/2005#home',
          },
        ],
        gContact$groupMembershipInfo: [
          {
            deleted: 'false',
            href: 'http://www.google.com/m8/feeds/groups/testuser%40gmail.com/base/6',
          },
        ],
      },
      {
        id: {
          $t: 'http://www.google.com/m8/feeds/contacts/testuser%40gmail.com/base/19779cd0cdf63d0',
        },
        gd$etag: '"QHo6fzVSLyt7I2A9XRZTFUUIRAM."',
        updated: {
          $t: '2014-05-20T10:39:31.417Z',
        },
        app$edited: {
          xmlns$app: 'http://www.w3.org/2007/app',
          $t: '2014-05-20T10:39:31.417Z',
        },
        category: [
          {
            scheme: 'http://schemas.google.com/g/2005#kind',
            term: 'http://schemas.google.com/contact/2008#contact',
          },
        ],
        title: {
          $t: 'Contact Four',
        },
        link: [
          {
            rel: 'http://schemas.google.com/contacts/2008/rel#photo',
            type: 'image/*',
            href: 'https://www.google.com/m8/feeds/photos/media/testuser%40gmail.com/19779cd0cdf63d0',
          },
          {
            rel: 'self',
            type: 'application/atom+xml',
            href: 'https://www.google.com/m8/feeds/contacts/testuser%40gmail.com/full/19779cd0cdf63d0',
          },
          {
            rel: 'edit',
            type: 'application/atom+xml',
            href: 'https://www.google.com/m8/feeds/contacts/testuser%40gmail.com/full/19779cd0cdf63d0',
          },
        ],
        gd$name: {
          gd$fullName: {
            $t: 'Contact Four',
          },
          gd$givenName: {
            $t: 'Contact',
          },
          gd$familyName: {
            $t: 'Four',
          },
        },
        gd$email: [
          {
            address: 'four@mail.ru',
            primary: 'true',
            rel: 'http://schemas.google.com/g/2005#other',
          },
        ],
      },
      {
        id: {
          $t: 'http://www.google.com/m8/feeds/contacts/testuser%40gmail.com/base/1b7734a92b42f11',
        },
        gd$etag: '"QHsyeDVSLit7I2A9XR9VEkgDQAA."',
        updated: {
          $t: '2017-05-31T19:42:21.590Z',
        },
        app$edited: {
          xmlns$app: 'http://www.w3.org/2007/app',
          $t: '2017-05-31T19:42:21.590Z',
        },
        category: [
          {
            scheme: 'http://schemas.google.com/g/2005#kind',
            term: 'http://schemas.google.com/contact/2008#contact',
          },
        ],
        title: {
          $t: 'Contact Five',
        },
        link: [
          {
            rel: 'http://schemas.google.com/contacts/2008/rel#photo',
            type: 'image/*',
            href: 'https://www.google.com/m8/feeds/photos/media/testuser%40gmail.com/1b7734a92b42f11',
            gd$etag: '"QGxQH2FAWit7I2BaIERTFzdAMlxBP2xlTlM."',
          },
          {
            rel: 'self',
            type: 'application/atom+xml',
            href: 'https://www.google.com/m8/feeds/contacts/testuser%40gmail.com/full/1b7734a92b42f11',
          },
          {
            rel: 'edit',
            type: 'application/atom+xml',
            href: 'https://www.google.com/m8/feeds/contacts/testuser%40gmail.com/full/1b7734a92b42f11',
          },
        ],
        gd$name: {
          gd$fullName: {
            $t: 'Contact Five',
          },
          gd$givenName: {
            $t: 'Contact',
          },
          gd$familyName: {
            $t: 'Five',
          },
        },
        gd$email: [
          {
            address: 'five@mail.st',
            primary: 'true',
            rel: 'http://schemas.google.com/g/2005#other',
          },
          {
            address: 'five-home@mail.st',
            rel: 'http://schemas.google.com/g/2005#home',
          },
        ],
        gContact$groupMembershipInfo: [
          {
            deleted: 'false',
            href: 'http://www.google.com/m8/feeds/groups/testuser%40gmail.com/base/6',
          },
        ],
      },
      {
        id: {
          $t: 'http://www.google.com/m8/feeds/contacts/testuser%40gmail.com/base/21a311097e1974d',
        },
        gd$etag: '"SH86fD1WJyt7I2A9XRNVFEgLRw0."',
        updated: {
          $t: '2016-02-26T01:44:59.114Z',
        },
        app$edited: {
          xmlns$app: 'http://www.w3.org/2007/app',
          $t: '2016-02-26T01:44:59.114Z',
        },
        category: [
          {
            scheme: 'http://schemas.google.com/g/2005#kind',
            term: 'http://schemas.google.com/contact/2008#contact',
          },
        ],
        title: {
          $t: 'Contact Additional Six',
        },
        link: [
          {
            rel: 'http://schemas.google.com/contacts/2008/rel#photo',
            type: 'image/*',
            href: 'https://www.google.com/m8/feeds/photos/media/testuser%40gmail.com/21a311097e1974d',
            gd$etag: '"QBQvLwVFSit7I2BBKHwmRyJuIEZcGVp6fTo."',
          },
          {
            rel: 'self',
            type: 'application/atom+xml',
            href: 'https://www.google.com/m8/feeds/contacts/testuser%40gmail.com/full/21a311097e1974d',
          },
          {
            rel: 'edit',
            type: 'application/atom+xml',
            href: 'https://www.google.com/m8/feeds/contacts/testuser%40gmail.com/full/21a311097e1974d',
          },
        ],
        gd$name: {
          gd$fullName: {
            $t: 'Contact Additional Six',
          },
          gd$givenName: {
            $t: 'Contact',
          },
          gd$additionalName: {
            $t: 'Additional',
          },
          gd$familyName: {
            $t: 'Six',
          },
        },
        gd$email: [
          {
            address: 'six@mail.com',
            primary: 'true',
            rel: 'http://schemas.google.com/g/2005#other',
          },
        ],
        gd$phoneNumber: [
          {
            rel: 'http://schemas.google.com/g/2005#other',
            primary: 'true',
            uri: 'tel:+7-123-123-12-12',
            $t: '+7 (123) 123-1212',
          },
        ],
        gContact$groupMembershipInfo: [
          {
            deleted: 'false',
            href: 'http://www.google.com/m8/feeds/groups/testuser%40gmail.com/base/6',
          },
        ],
      },
    ],
  },
};
