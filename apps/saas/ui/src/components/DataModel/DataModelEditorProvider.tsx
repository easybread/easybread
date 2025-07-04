'use client';

import { ReactFlowProvider } from '@xyflow/react';
import {
  type PropsWithChildren,
  createContext,
  useContext,
  useState,
} from 'react';

import type { DataModelDef } from '@easybread/data-model';

import type { DtoDataModel } from 'saas-dto';

export type DataModelEditorContextType = {
  def: DataModelDef;
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

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  return (
    <ReactFlowProvider>
      <DataModelEditorContext.Provider value={{ def }}>
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
