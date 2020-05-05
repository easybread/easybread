export interface NormalizedCollectionState<T> {
  byId: { [key: string]: T };
  ids: string[];
}
