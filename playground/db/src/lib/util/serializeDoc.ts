import { WithId } from 'mongodb';

export type SerializedDoc<T extends object> = Omit<T, '_id'> & {
  _id: string;
};

export const serializeDoc = <T extends WithId<object>>(
  document: T
): SerializedDoc<T> => {
  const { _id, ...rest } = document;
  return { _id: String(_id), ...rest };
};
