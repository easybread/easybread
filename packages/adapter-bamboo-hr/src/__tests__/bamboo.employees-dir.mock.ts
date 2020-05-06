export const BAMBOO_EMPLOYEES_DIR_MOCK = {
  employees: [
    {
      canUploadPhoto: 1,
      department: 'IT',
      displayName: 'Test Employee',
      division: 'web',
      firstName: 'Test',
      gender: 'Male',
      id: '112',
      jobTitle: 'JavaScript Developer',
      lastName: 'Employee',
      linkedIn: null,
      location: 'Remote',
      mobilePhone: null,
      photoUploaded: false,
      photoUrl:
        'https://spaceagencyupwork.bamboohr.com/images/photo_placeholder.gif',
      preferredName: 'T-one',
      workEmail: '2110pro@mail.ru',
      workPhone: '+71231231212',
      workPhoneExtension: null
    },
    {
      canUploadPhoto: 1,
      department: 'IT',
      displayName: 'Test Employee2',
      division: 'web',
      firstName: 'Test',
      gender: 'Male',
      id: '113',
      jobTitle: 'JavaScript Developer',
      lastName: 'Employee2',
      linkedIn: null,
      location: 'Remote',
      mobilePhone: null,
      photoUploaded: false,
      photoUrl:
        'https://spaceagencyupwork.bamboohr.com/images/photo_placeholder.gif',
      preferredName: 'T-one',
      workEmail: 'test2@mail.ru',
      workPhone: '+71231231213',
      workPhoneExtension: null
    }
  ],
  fields: [
    {
      id: 'displayName',
      name: 'Display name',
      type: 'text'
    },
    {
      id: 'firstName',
      name: 'First name',
      type: 'text'
    },
    {
      id: 'lastName',
      name: 'Last name',
      type: 'text'
    },
    {
      id: 'preferredName',
      name: 'Preferred name',
      type: 'text'
    },
    {
      id: 'gender',
      name: 'Gender',
      type: 'gender'
    },
    {
      id: 'jobTitle',
      name: 'Job title',
      type: 'list'
    },
    {
      id: 'workPhone',
      name: 'Work Phone',
      type: 'text'
    },
    {
      id: 'mobilePhone',
      name: 'Mobile Phone',
      type: 'text'
    },
    {
      id: 'workEmail',
      name: 'Work Email',
      type: 'email'
    },
    {
      id: 'department',
      name: 'Department',
      type: 'list'
    },
    {
      id: 'location',
      name: 'Location',
      type: 'list'
    },
    {
      id: 'division',
      name: 'Division',
      type: 'list'
    },
    {
      id: 'linkedIn',
      name: 'LinkedIn URL',
      type: 'text'
    },
    {
      id: 'workPhoneExtension',
      name: 'Work Ext.',
      type: 'text'
    },
    {
      id: 'photoUploaded',
      name: 'Employee photo exists',
      type: 'bool'
    },
    {
      id: 'photoUrl',
      name: 'Employee photo url',
      type: 'url'
    },
    {
      id: 'canUploadPhoto',
      name: '',
      type: 'bool'
    }
  ]
};
