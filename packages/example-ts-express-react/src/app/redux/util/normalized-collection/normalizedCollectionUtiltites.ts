import { omit, without } from 'lodash';

import { NormalizedCollectionState } from './NormalizedCollectionState';

export function clearNormalizedCollection(
  collection: NormalizedCollectionState<unknown>
): void {
  collection.ids = [];
}

export function updateNormalizedCollection<T>(
  collection: NormalizedCollectionState<T>,
  data: T[],
  getId: (item: T) => string
): void {
  clearNormalizedCollection(collection);
  data.reverse().forEach(item => {
    const id = getId(item);
    collection.byId[id] = item;
    collection.ids.unshift(id);
  });
}

export function updateNormalizedCollectionItem<T>(
  collection: NormalizedCollectionState<T>,
  item: T,
  getId: (item: T) => string
): void {
  Object.assign(collection[getId(item)], item);
}

export function createNormalizedCollectionItem<T>(
  collection: NormalizedCollectionState<T>,
  item: T,
  getId: (item: T) => string
): void {
  const id = getId(item);
  collection.byId[id] = item;
  collection.ids.unshift(id);
}

export function deleteNormalizedCollectionItem<T>(
  collection: NormalizedCollectionState<T>,
  id: string
): void {
  omit(collection.byId, id);
  collection.ids = without(collection.ids, id);
}

export function createNormalizedCollectionState<T>(): NormalizedCollectionState<
  T
> {
  return {
    byId: {},
    ids: []
  };
}
