'use client';

import { useQuery } from '@tanstack/react-query';

import type { DataModelDef } from '@easybread/data-model';

import type { DtoDataModel } from 'saas-dto';
import { useTRPC } from 'saas-trpc';

import { LoadingState } from '../LoadingState/LoadingState';

import { DataModelEditor } from './DataModelEditor';
import { DataModelEditorProvider } from './DataModelEditorProvider';
import { DataModelNoModelState } from './DataModelNoModelState';

const MOCK_DATA: DtoDataModel = {
  id: '1',
  orgId: '1',
  connectionId: '1',
  version: 1,
  namespaces: ['public'],
  createdAt: new Date(),
  updatedAt: new Date(),
  name: 'Test Data Model',
  def: {
    name: 'Test Data Model',
    relations: [
      {
        id: 'public_employeeProfiles_to_public_users',
        to: {
          mul: 'ONE',
          entity: 'users',
          namespace: 'public',
          fieldNames: ['id'],
        },
        from: {
          mul: 'MANY',
          entity: 'employeeProfile',
          namespace: 'public',
          fieldNames: ['userId'],
        },
        onDelete: 'CASCADE',
        onUpdate: null,
      },
    ],
    enums: [],
    namespaces: ['public'],
    entities: [
      {
        name: 'users',
        fields: {
          id: {
            pk: true,
            type: 'UUID',
            unique: false,
            nullable: false,
            algorithm: 'UUID_V7',
          },
          email: {
            pk: false,
            type: 'STRING',
            unique: true,
            nullable: false,
          },
          passwordHash: {
            pk: false,
            type: 'STRING',
            unique: false,
            nullable: false,
          },
          passwordSalt: {
            pk: false,
            type: 'STRING',
            unique: false,
            nullable: false,
          },
        },
        namespace: 'public',
      },
      {
        name: 'employeeProfile',
        fields: {
          id: {
            pk: true,
            type: 'UUID',
            unique: false,
            nullable: false,
            algorithm: 'UUID_V7',
          },
          orgId: {
            pk: false,
            type: 'UUID',
            unique: false,
            nullable: false,
            algorithm: 'UUID_V7',
          },
          userId: {
            pk: false,
            type: 'UUID',
            unique: false,
            nullable: false,
            algorithm: 'UUID_V7',
          },
          endedAt: {
            pk: false,
            type: 'DATE',
            unique: false,
            nullable: true,
          },
          jobTitle: {
            pk: false,
            type: 'STRING',
            unique: false,
            nullable: false,
          },
          addressId: {
            pk: false,
            type: 'UUID',
            unique: false,
            nullable: true,
            algorithm: 'UUID_V7',
          },
          startedAt: {
            pk: false,
            type: 'DATE',
            unique: false,
            nullable: false,
          },
          skillsetId: {
            pk: false,
            type: 'UUID',
            unique: false,
            nullable: true,
            algorithm: 'UUID_V7',
          },
          departmentId: {
            pk: false,
            type: 'UUID',
            unique: false,
            nullable: true,
            algorithm: 'UUID_V7',
          },
          commitmentType: {
            pk: false,
            type: 'ENUM',
            unique: false,
            enumName: 'commitmentTypeEnum',
            nullable: false,
            namespace: 'public',
          },
          engagementType: {
            pk: false,
            type: 'ENUM',
            unique: false,
            enumName: 'employmentTypeEnum',
            nullable: false,
            namespace: 'public',
          },
          personalDetailsId: {
            pk: false,
            type: 'UUID',
            unique: false,
            nullable: true,
            algorithm: 'UUID_V7',
          },
        },
        namespace: 'public',
      },
    ],
  } satisfies DataModelDef,
};

export function DataModel({ connectionId }: { connectionId: string }) {
  const trpc = useTRPC();

  const dataModel = useQuery(
    trpc.connections.dataModelFetch.queryOptions(
      { id: connectionId },
      {
        retry(failureCount, error) {
          if (error.data?.code === 'NOT_FOUND') {
            return false;
          }
          return failureCount < 2;
        },
      },
    ),
  );

  if (dataModel.isLoading) {
    return <LoadingState />;
  }

  if (dataModel.error && dataModel.error.data?.code === 'NOT_FOUND') {
    return <DataModelNoModelState connectionId={connectionId} />;
  }

  if (!dataModel.data?.def) {
    return (
      <div>No data model definition. Try to introspect the data source.</div>
    );
  }

  // return <DataModelEditor dataModel={MOCK_DATA} />;
  return (
    <DataModelEditorProvider dataModel={dataModel.data}>
      <DataModelEditor />
    </DataModelEditorProvider>
  );
}
