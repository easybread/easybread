/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { DataModelDef } from '../../../../DataModel.js';
import { FIELD_TYPE } from '../../../../DataModel.js';
import type { DbmlSchema } from '../DbmlSchema.js';
import {
  IntrospectionFactoryPostgres,
  type IntrospectionFactoryPostgresConfig,
  introspectPostgres,
} from '../PostgresFactory.js';
import { SchemaFetcherDbml } from '../SchemaFetcherDbml.js';

// Mock only the SchemaFetcherDbml to control database responses
jest.mock('../SchemaFetcherDbml.js');

const MockedSchemaFetcherDbml = SchemaFetcherDbml as jest.MockedClass<
  typeof SchemaFetcherDbml
>;

describe('PostgresFactory Integration Tests', () => {
  let mockFetchSchema: jest.MockedFunction<any>;

  // Realistic test data representing a typical PostgreSQL schema
  const mockDbmlSchema: DbmlSchema = {
    tables: [
      {
        name: 'users',
        schemaName: 'public',
        note: { value: 'User accounts table' },
      },
      {
        name: 'posts',
        schemaName: 'public',
        note: { value: 'Blog posts table' },
      },
      {
        name: 'companies',
        schemaName: 'business',
        note: { value: 'Company information' },
      },
    ],
    fields: {
      'public.users': [
        {
          name: 'id',
          type: { type_name: 'uuid', schemaName: null },
          dbdefault: { type: 'expression', value: 'gen_random_uuid()' },
          not_null: true,
          increment: false,
          note: { value: 'Primary key' },
        },
        {
          name: 'email',
          type: { type_name: 'varchar', schemaName: null },
          dbdefault: null,
          not_null: true,
          increment: false,
          note: { value: 'User email address' },
        },
        {
          name: 'name',
          type: { type_name: 'varchar', schemaName: null },
          dbdefault: null,
          not_null: false,
          increment: false,
          note: { value: 'User full name' },
        },
        {
          name: 'created_at',
          type: { type_name: 'timestamp', schemaName: null },
          dbdefault: { type: 'expression', value: 'now()' },
          not_null: true,
          increment: false,
          note: { value: 'Account creation timestamp' },
        },
        {
          name: 'company_id',
          type: { type_name: 'uuid', schemaName: null },
          dbdefault: null,
          not_null: false,
          increment: false,
          note: { value: 'Reference to company' },
        },
      ],
      'public.posts': [
        {
          name: 'id',
          type: { type_name: 'uuid', schemaName: null },
          dbdefault: { type: 'expression', value: 'gen_random_uuid()' },
          not_null: true,
          increment: false,
          note: { value: 'Primary key' },
        },
        {
          name: 'title',
          type: { type_name: 'varchar', schemaName: null },
          dbdefault: null,
          not_null: true,
          increment: false,
          note: { value: 'Post title' },
        },
        {
          name: 'content',
          type: { type_name: 'text', schemaName: null },
          dbdefault: null,
          not_null: false,
          increment: false,
          note: { value: 'Post content' },
        },
        {
          name: 'published',
          type: { type_name: 'boolean', schemaName: null },
          dbdefault: { type: 'boolean', value: 'false' },
          not_null: true,
          increment: false,
          note: { value: 'Publication status' },
        },
        {
          name: 'author_id',
          type: { type_name: 'uuid', schemaName: null },
          dbdefault: null,
          not_null: true,
          increment: false,
          note: { value: 'Post author' },
        },
      ],
      'business.companies': [
        {
          name: 'id',
          type: { type_name: 'uuid', schemaName: null },
          dbdefault: { type: 'expression', value: 'gen_random_uuid()' },
          not_null: true,
          increment: false,
          note: { value: 'Primary key' },
        },
        {
          name: 'name',
          type: { type_name: 'varchar', schemaName: null },
          dbdefault: null,
          not_null: true,
          increment: false,
          note: { value: 'Company name' },
        },
      ],
    },
    refs: [
      {
        name: 'posts_author_id_fkey',
        endpoints: [
          {
            tableName: 'posts',
            schemaName: 'public',
            fieldNames: ['author_id'],
            relation: '*',
          },
          {
            tableName: 'users',
            schemaName: 'public',
            fieldNames: ['id'],
            relation: '1',
          },
        ],
        onDelete: 'CASCADE',
        onUpdate: null,
      },
      {
        name: 'users_company_id_fkey',
        endpoints: [
          {
            tableName: 'users',
            schemaName: 'public',
            fieldNames: ['company_id'],
            relation: '*',
          },
          {
            tableName: 'companies',
            schemaName: 'business',
            fieldNames: ['id'],
            relation: '1',
          },
        ],
        onDelete: 'SET_NULL',
        onUpdate: null,
      },
    ],
    enums: [
      {
        name: 'user_status',
        schemaName: 'public',
        values: [{ name: 'ACTIVE' }, { name: 'INACTIVE' }, { name: 'PENDING' }],
      },
    ],
    indexes: {
      'public.users': [
        {
          name: 'users_email_idx',
          type: 'UNIQUE',
          columns: [{ type: 'column', value: 'email' }],
        },
      ],
      'public.posts': [
        {
          name: 'posts_author_id_idx',
          type: 'BTREE',
          columns: [{ type: 'column', value: 'author_id' }],
        },
      ],
    },
    tableConstraints: {
      'public.users': {
        id: { pk: true },
        email: { unique: true },
      },
      'public.posts': {
        id: { pk: true },
      },
      'business.companies': {
        id: { pk: true },
      },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockFetchSchema = jest.fn().mockResolvedValue(mockDbmlSchema);
    MockedSchemaFetcherDbml.mockImplementation(
      () => ({ fetchSchema: mockFetchSchema }) as any,
    );
  });

  describe('Factory Creation and Integration', () => {
    const baseConfig: IntrospectionFactoryPostgresConfig = {
      connectionString: 'postgresql://user:pass@localhost:5432/testdb',
    };

    it('should create strategy and transform schema successfully', async () => {
      const strategy = IntrospectionFactoryPostgres.create(baseConfig);
      const result = await strategy.introspect();

      expect(MockedSchemaFetcherDbml).toHaveBeenCalledWith(baseConfig);
      expect(mockFetchSchema).toHaveBeenCalledTimes(1);
      expect(result).toMatchObject({
        name: 'testdb',
        entities: expect.any(Array),
        relations: expect.any(Array),
        enums: expect.any(Array),
        namespaces: expect.any(Array),
      });
    });

    it('should handle database name extraction from connection string', async () => {
      const configs = [
        {
          connectionString: 'postgresql://localhost/my_database',
          expectedName: 'my_database',
        },
        {
          connectionString: 'postgresql://localhost:5432/production_app',
          expectedName: 'production_app',
        },
      ];

      for (const { connectionString, expectedName } of configs) {
        const strategy = IntrospectionFactoryPostgres.create({
          connectionString,
        });
        const result = await strategy.introspect();

        expect(result.name).toBe(expectedName);
      }
    });

    it('should use explicit database name when provided', async () => {
      const config = {
        ...baseConfig,
        databaseName: 'custom_model_name',
      };

      const strategy = IntrospectionFactoryPostgres.create(config);
      const result = await strategy.introspect();

      expect(result.name).toBe('custom_model_name');
    });
  });

  describe('Data Transformation Verification', () => {
    const config: IntrospectionFactoryPostgresConfig = {
      connectionString: 'postgresql://localhost:5432/testdb',
    };

    it('should transform tables into entities correctly', async () => {
      const result = await introspectPostgres(config);

      expect(result.entities).toHaveLength(3);

      // Check users entity
      const usersEntity = result.entities.find(e => e.name === 'users');
      expect(usersEntity).toBeDefined();
      expect(usersEntity!.namespace).toBe('public');
      expect(usersEntity!.fields).toHaveProperty('id');
      expect(usersEntity!.fields).toHaveProperty('email');
      expect(usersEntity!.fields).toHaveProperty('name');
      expect(usersEntity!.fields).toHaveProperty('created_at');
      expect(usersEntity!.fields).toHaveProperty('company_id');

      // Check companies entity with different namespace
      const companiesEntity = result.entities.find(e => e.name === 'companies');
      expect(companiesEntity).toBeDefined();
      expect(companiesEntity!.namespace).toBe('business');
    });

    it('should transform field types correctly', async () => {
      const result = await introspectPostgres(config);
      const usersEntity = result.entities.find(e => e.name === 'users')!;

      // UUID field
      expect(usersEntity.fields.id.type).toBe(FIELD_TYPE.enum.UUID);
      expect(usersEntity.fields.id.pk).toBe(true);
      expect(usersEntity.fields.id.nullable).toBe(false);

      // String field
      expect(usersEntity.fields.email.type).toBe(FIELD_TYPE.enum.STRING);
      expect(usersEntity.fields.email.nullable).toBe(false);
      expect(usersEntity.fields.email.unique).toBe(true);

      // Nullable string field
      expect(usersEntity.fields.name.type).toBe(FIELD_TYPE.enum.STRING);
      expect(usersEntity.fields.name.nullable).toBe(true);

      // Date field
      expect(usersEntity.fields.created_at.type).toBe(FIELD_TYPE.enum.DATE);
      expect(usersEntity.fields.created_at.nullable).toBe(false);

      // Boolean field in posts (note: transformer currently maps boolean as STRING)
      const postsEntity = result.entities.find(e => e.name === 'posts')!;
      expect(postsEntity.fields.published.type).toBe(FIELD_TYPE.enum.STRING);
      expect(postsEntity.fields.published.defaultValue).toBe(false);
    });

    it('should transform relations correctly', async () => {
      const result = await introspectPostgres(config);

      expect(result.relations).toHaveLength(2);

      // Posts -> Users relation
      const postsAuthorRelation = result.relations.find(
        r => r.from.entity === 'posts' && r.to.entity === 'users',
      );
      expect(postsAuthorRelation).toBeDefined();
      expect(postsAuthorRelation!.from.fieldNames).toEqual(['author_id']);
      expect(postsAuthorRelation!.to.fieldNames).toEqual(['id']);
      expect(postsAuthorRelation!.onDelete).toBe('CASCADE');

      // Users -> Companies relation (cross-namespace)
      const usersCompanyRelation = result.relations.find(
        r => r.from.entity === 'users' && r.to.entity === 'companies',
      );
      expect(usersCompanyRelation).toBeDefined();
      expect(usersCompanyRelation!.from.namespace).toBe('public');
      expect(usersCompanyRelation!.to.namespace).toBe('business');
      expect(usersCompanyRelation!.onDelete).toBe('SET_NULL');
    });

    it('should transform enums correctly', async () => {
      const result = await introspectPostgres(config);

      expect(result.enums).toHaveLength(1);

      const userStatusEnum = result.enums.find(e => e.name === 'user_status');
      expect(userStatusEnum).toBeDefined();
      expect(userStatusEnum!.namespace).toBe('public');
      expect(userStatusEnum!.values).toEqual(['ACTIVE', 'INACTIVE', 'PENDING']);
    });

    it('should extract namespaces correctly', async () => {
      const result = await introspectPostgres(config);

      expect(result.namespaces).toContain('public');
      expect(result.namespaces).toContain('business');
      expect(result.namespaces).toHaveLength(2);
    });
  });

  describe('Error Handling Integration', () => {
    const config: IntrospectionFactoryPostgresConfig = {
      connectionString: 'postgresql://localhost:5432/testdb',
    };

    it('should propagate database connection errors', async () => {
      const dbError = new Error('Connection timeout');
      mockFetchSchema.mockRejectedValue(dbError);

      const strategy = IntrospectionFactoryPostgres.create(config);

      await expect(strategy.introspect()).rejects.toThrow(
        'Failed to introspect schema',
      );
    });

    it('should handle invalid schema data gracefully', async () => {
      const invalidSchema = {
        tables: [],
        fields: {},
        refs: [],
        enums: [],
        indexes: {},
        tableConstraints: {},
      } as DbmlSchema;

      mockFetchSchema.mockResolvedValue(invalidSchema);

      const result = await introspectPostgres(config);

      expect(result.entities).toHaveLength(0);
      expect(result.relations).toHaveLength(0);
      expect(result.enums).toHaveLength(0);
      expect(result.namespaces).toHaveLength(0);
    });
  });

  describe('Configuration Integration', () => {
    it('should pass all configuration options to fetcher', async () => {
      const fullConfig: IntrospectionFactoryPostgresConfig = {
        connectionString: 'postgresql://localhost:5432/testdb',
        databaseName: 'custom_db',
        timeout: 30000,
        retries: 3,
        retryDelay: 1000,
        schemaFilter: ['public', 'business'],
      };

      await introspectPostgres(fullConfig);

      expect(MockedSchemaFetcherDbml).toHaveBeenCalledWith(fullConfig);
    });

    it('should work with minimal configuration', async () => {
      const minimalConfig: IntrospectionFactoryPostgresConfig = {
        connectionString: 'postgresql://localhost:5432/simple_db',
      };

      const result = await introspectPostgres(minimalConfig);

      expect(result.name).toBe('simple_db');
      expect(MockedSchemaFetcherDbml).toHaveBeenCalledWith(minimalConfig);
    });
  });

  describe('Advanced Factory Usage', () => {
    it('should support dependency injection pattern', async () => {
      const customFetcher = {
        fetchSchema: jest.fn().mockResolvedValue(mockDbmlSchema),
      } as any;

      const customTransformer = {
        transform: jest.fn().mockReturnValue({
          name: 'injected_model',
          entities: [],
          relations: [],
          enums: [],
          namespaces: [],
        } as DataModelDef),
      } as any;

      const strategy = IntrospectionFactoryPostgres.createAdvanced(
        customFetcher,
        customTransformer,
        'injected_model',
      );

      const result = await strategy.introspect();

      expect(customFetcher.fetchSchema).toHaveBeenCalledTimes(1);
      expect(customTransformer.transform).toHaveBeenCalledWith(
        mockDbmlSchema,
        'injected_model',
      );
      expect(result.name).toBe('injected_model');
    });
  });

  describe('Complex Schema Scenarios', () => {
    it('should handle schemas with multiple namespaces', async () => {
      const complexSchema: DbmlSchema = {
        ...mockDbmlSchema,
        tables: [
          ...mockDbmlSchema.tables,
          {
            name: 'audit_logs',
            schemaName: 'audit',
            note: { value: 'System audit logs' },
          },
        ],
        fields: {
          ...mockDbmlSchema.fields,
          'audit.audit_logs': [
            {
              name: 'id',
              type: { type_name: 'bigserial', schemaName: null },
              dbdefault: null,
              not_null: true,
              increment: true,
              note: { value: 'Auto-incrementing ID' },
            },
          ],
        },
      };

      mockFetchSchema.mockResolvedValue(complexSchema);

      const result = await introspectPostgres({
        connectionString: 'postgresql://localhost:5432/complex_db',
      });

      expect(result.namespaces).toContain('audit');
      expect(result.namespaces).toHaveLength(3);

      const auditEntity = result.entities.find(e => e.name === 'audit_logs');
      expect(auditEntity).toBeDefined();
      expect(auditEntity!.namespace).toBe('audit');
    });
  });

  describe('Real-life schema', () => {
    it('should transform the schema correctly', async () => {
      const fetchSchemaResponse = require('./dbml.json');
      mockFetchSchema.mockResolvedValue(fetchSchemaResponse);

      const result = await introspectPostgres({
        connectionString: 'postgresql://localhost:5432/testdb',
        databaseName: 'saas',
      });

      expect(result).toMatchSnapshot();
      expect(result.name).toBe('saas');
    });
  });
});
