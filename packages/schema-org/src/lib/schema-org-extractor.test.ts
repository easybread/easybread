import { workspaceRoot } from '@nx/devkit';
import { existsSync, readFileSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';

import {
  type SchemaDefinition,
  SchemaOrgExtractor,
  lookupClass,
  writeResults,
} from './schema-org-extractor.js';

const schemaPath = join(
  workspaceRoot,
  'packages/schema-org/raw-definitions/schema.org.current.jsonld',
);

const testOutputPath = join(
  workspaceRoot,
  'packages/schema-org/raw-definitions/by-class/Test.json',
);

describe('SchemaOrgExtractor', () => {
  let extractor: SchemaOrgExtractor;

  beforeAll(() => {
    extractor = new SchemaOrgExtractor(schemaPath);
  });

  describe('initialization', () => {
    it('should load and index schema definitions', () => {
      const stats = extractor.getStats();
      expect(stats.totalDefinitions).toBeGreaterThan(0);
      expect(stats.totalClasses).toBeGreaterThan(0);
      expect(stats.totalProperties).toBeGreaterThan(0);
    });
  });

  describe('lookupClass', () => {
    it('should extract Person class with properties', () => {
      const results = extractor.lookupClass('Person');
      expect(results.size).toBeGreaterThan(1);

      const definitions = Array.from(results);
      const classDefinition = definitions.find(
        d => d['@id'] === 'schema:Person',
      );
      expect(classDefinition).toBeDefined();
      expect(classDefinition?.['@type']).toBe('rdfs:Class');

      // Should have properties with Person in domainIncludes
      const properties = definitions.filter(d => d['@type'] === 'rdf:Property');
      expect(properties.length).toBeGreaterThan(0);
    });

    it('should extract Occupation class with properties', () => {
      const results = extractor.lookupClass('Occupation');
      expect(results.size).toBeGreaterThan(1);

      const definitions = Array.from(results);
      const classDefinition = definitions.find(
        d => d['@id'] === 'schema:Occupation',
      );
      expect(classDefinition).toBeDefined();
      expect(classDefinition?.['@type']).toBe('rdfs:Class');
    });

    it('should extract DateTime class (data type)', () => {
      const results = extractor.lookupClass('DateTime');
      expect(results.size).toBeGreaterThanOrEqual(1);

      const definitions = Array.from(results);
      const classDefinition = definitions.find(
        d => d['@id'] === 'schema:DateTime',
      );
      expect(classDefinition).toBeDefined();
      expect(classDefinition?.['@type']).toEqual([
        'rdfs:Class',
        'schema:DataType',
      ]);
    });

    it('should extract EmployeeRole class with properties', () => {
      const results = extractor.lookupClass('EmployeeRole');
      expect(results.size).toBeGreaterThan(1);

      const definitions = Array.from(results);
      const classDefinition = definitions.find(
        d => d['@id'] === 'schema:EmployeeRole',
      );
      expect(classDefinition).toBeDefined();
      expect(classDefinition?.['@type']).toBe('rdfs:Class');

      // Should include baseSalary and salaryCurrency properties
      const properties = definitions.filter(d => d['@type'] === 'rdf:Property');
      const propertyIds = properties.map(p => p['@id']);
      expect(propertyIds).toContain('schema:baseSalary');
      expect(propertyIds).toContain('schema:salaryCurrency');
    });

    it('should handle class names with and without schema: prefix', () => {
      const results1 = extractor.lookupClass('Person');
      const results2 = extractor.lookupClass('schema:Person');

      expect(results1.size).toBe(results2.size);
      expect(Array.from(results1)).toEqual(Array.from(results2));
    });

    it('should throw error for non-existent class', () => {
      expect(() => extractor.lookupClass('NonExistentClass')).toThrow(
        'Class NonExistentClass not found in schema.org.current.jsonld',
      );
    });
  });

  describe('writeResults', () => {
    afterEach(() => {
      if (existsSync(testOutputPath)) {
        unlinkSync(testOutputPath);
      }
    });

    it('should write results to JSON file', () => {
      const results = extractor.lookupClass('DateTime');
      writeResults(results, testOutputPath);

      expect(existsSync(testOutputPath)).toBe(true);

      // Verify the file content
      const writtenContent = readJson(testOutputPath);
      expect(Array.isArray(writtenContent)).toBe(true);
      expect(writtenContent.length).toBe(results.size);

      // Should have class definition first
      expect(writtenContent[0]['@id']).toBe('schema:DateTime');
      expect(writtenContent[0]['@type']).toEqual([
        'rdfs:Class',
        'schema:DataType',
      ]);
    });

    it('should sort results with class definitions first', () => {
      const results = extractor.lookupClass('EmployeeRole');
      writeResults(results, testOutputPath);

      const writtenContent = readJson(testOutputPath);
      const classDefinitions = writtenContent.filter(
        (d: SchemaDefinition) =>
          d['@type'] === 'rdfs:Class' ||
          (Array.isArray(d['@type']) && d['@type'].includes('rdfs:Class')),
      );
      const propertyDefinitions = writtenContent.filter(
        (d: SchemaDefinition) => d['@type'] === 'rdf:Property',
      );

      expect(writtenContent.length).toBeGreaterThan(0);
      expect(classDefinitions.length).toBeGreaterThan(0);
      expect(propertyDefinitions.length).toBeGreaterThan(0);

      // Class definitions should come first
      expect(writtenContent.indexOf(classDefinitions[0])).toBeLessThan(
        writtenContent.indexOf(propertyDefinitions[0]),
      );
    });
  });

  describe('standalone lookupClass function', () => {
    it('should work with default schema path', () => {
      const results = lookupClass('DateTime', schemaPath);
      expect(results.size).toBeGreaterThanOrEqual(1);

      const definitions = Array.from(results);
      const classDefinition = definitions.find(
        d => d['@id'] === 'schema:DateTime',
      );
      expect(classDefinition).toBeDefined();
    });

    it('should work with custom schema path', () => {
      const results = lookupClass('DateTime', schemaPath);
      expect(results.size).toBeGreaterThanOrEqual(1);
    });
  });
});

function readJson(path: string) {
  return JSON.parse(readFileSync(path, 'utf-8'));
}
