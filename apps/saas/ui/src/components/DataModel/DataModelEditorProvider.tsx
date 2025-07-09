'use client';

import { ReactFlowProvider } from '@xyflow/react';
import {
  type PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useMemo,
} from 'react';

import type {
  DataModelDef,
  EntityDef,
  RelationDef,
} from '@easybread/data-model';

import type { DtoDataModel } from 'saas-dto';

import {
  isRelatedEndpoint,
  makeEntityId,
  makeEntityIdFromRelationEndpoint,
} from './utils';

export type DataModelEditorContextType = {
  def: DataModelDef;
  getRelation: (id: string) => RelationDef<EntityDef, EntityDef> | undefined;
  getEntity: (id: string) => EntityDef | undefined;
  getRelatedEntityId: (
    entityId: string,
    relationId: string,
  ) => string | undefined;
  getRelatedEntity: (
    entityId: string,
    relationId: string,
  ) => EntityDef | undefined;
};

export const DataModelEditorContext =
  createContext<DataModelEditorContextType | null>(null);

export function DataModelEditorProvider({
  children,
  dataModel,
}: PropsWithChildren<{
  dataModel: DtoDataModel;
}>) {
  const def = dataModel.def as DataModelDef;

  const relMap = useMemo(() => {
    return new Map(def.relations.map(rel => [rel.id, rel]));
  }, [def.relations]);

  const entityMap = useMemo(() => {
    return new Map(def.entities.map(entity => [makeEntityId(entity), entity]));
  }, [def.entities]);

  const getRelation = useCallback((id: string) => relMap.get(id), [relMap]);
  const getEntity = useCallback((id: string) => entityMap.get(id), [entityMap]);
  const getRelatedEntityId = useCallback(
    (entityId: string, relationId: string) => {
      const rel = getRelation(relationId);
      const entity = getEntity(entityId);

      if (!rel || !entity) return undefined;

      if (isRelatedEndpoint(rel.from, entity)) {
        return makeEntityIdFromRelationEndpoint(rel.to);
      }

      if (isRelatedEndpoint(rel.to, entity)) {
        return makeEntityIdFromRelationEndpoint(rel.from);
      }
    },
    [getRelation, getEntity],
  );

  const getRelatedEntity = useCallback(
    (entityId: string, relationId: string) => {
      const relatedEntityId = getRelatedEntityId(entityId, relationId);
      return relatedEntityId ? getEntity(relatedEntityId) : undefined;
    },
    [getRelatedEntityId, getEntity],
  );

  return (
    <ReactFlowProvider>
      <DataModelEditorContext.Provider
        value={{
          def,
          getRelation,
          getEntity,
          getRelatedEntityId,
          getRelatedEntity,
        }}
      >
        {children}
      </DataModelEditorContext.Provider>
    </ReactFlowProvider>
  );
}

export function useDataModelEditor() {
  const context = useContext(DataModelEditorContext);
  if (!context) {
    throw new Error(
      'useDataModelEditor must be used within a DataModelEditorProvider',
    );
  }
  return context;
}
