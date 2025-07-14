type DBFooUser = {
  orgId: string;
  name: string;
  email: string;
  id: string;
};

type DBBarUser = {
  uuid: string;
  firstName?: string;
  lastName?: string;
  emailAddress: string;
};

type DBPagination = {
  skip: number;
  count: number;
};

export function makeDbFooUsersArray(orgId: string, count: number) {
  return Array.from({ length: count }, (_, i) => ({
    orgId,
    name: `User ${i}`,
    email: `user${i}@example.com`,
    id: crypto.randomUUID(),
  }));
}

export function makeDbBarUsersArray(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    uuid: crypto.randomUUID(),
    firstName: `User ${i}`,
    lastName: `User ${i}`,
    emailAddress: `user${i}@example.com`,
  }));
}

export async function findFooUsers(params: {
  orgId: string;
  pagination: DBPagination;
}) {
  if (params.pagination.skip > 300) {
    return {
      users: [],
      pagination: params.pagination,
    };
  }

  return {
    users: makeDbFooUsersArray(params.orgId, params.pagination.count),
    pagination: params.pagination,
  };
}

export async function findBarUsers(params: { pagination: DBPagination }) {
  if (params.pagination.skip > 300) {
    return {
      users: [],
      pagination: params.pagination,
    };
  }

  return {
    users: makeDbBarUsersArray(params.pagination.count),
    pagination: params.pagination,
  };
}

export async function upsertUserInDB(user: Omit<DBFooUser, 'id'>) {
  console.log(`writing user ${user.email} to db`);
  await new Promise(resolve => setTimeout(resolve, 200));
  return { ...user, id: crypto.randomUUID() } as DBFooUser;
}
