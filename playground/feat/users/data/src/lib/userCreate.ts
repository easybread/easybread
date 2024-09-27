import { userCollection } from 'playground-db';
import { passwordHash } from './passwordUtils';

interface UserCreateProps {
  email: string;
  password: string;
}

export async function userCreate(props: UserCreateProps) {
  const { email, password } = props;

  const user = await userCollection().insertOne(
    {
      email,
      passwordHash: passwordHash(password),
    },
    {}
  );

  return { _id: user.insertedId, email };
}
