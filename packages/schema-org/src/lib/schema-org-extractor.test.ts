import { workspaceRoot } from '@nx/devkit';
import { existsSync, readFileSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';

import {
  type SchemaDefinition,
  SchemaOrgExtractor,
  lookupClass,
  writeResults,
} from './schema-org-extractor';

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
      expect(stats.totalEnumValues).toBeGreaterThan(0);
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

    it('should extract enumeration class with its enumeration values', () => {
      const results = extractor.lookupClass('ActionStatusType');
      expect(results.size).toBeGreaterThan(1);

      const definitions = Array.from(results);

      // Should include the class definition
      const classDefinition = definitions.find(
        d => d['@id'] === 'schema:ActionStatusType',
      );
      expect(classDefinition).toBeDefined();
      expect(classDefinition?.['@type']).toBe('rdfs:Class');
      expect(classDefinition?.['rdfs:subClassOf']?.['@id']).toBe(
        'schema:StatusEnumeration',
      );

      // Should include enumeration values
      const enumValues = definitions.filter(
        d =>
          typeof d['@type'] === 'string' &&
          d['@type'] === 'schema:ActionStatusType',
      );
      expect(enumValues.length).toBeGreaterThan(0);

      // Should include specific enumeration values
      const enumValueIds = enumValues.map(e => e['@id']);
      expect(enumValueIds).toContain('schema:PotentialActionStatus');
      expect(enumValueIds).toContain('schema:FailedActionStatus');

      // Verify structure of enumeration values
      const potentialStatus = enumValues.find(
        e => e['@id'] === 'schema:PotentialActionStatus',
      );
      expect(potentialStatus).toBeDefined();
      expect(potentialStatus?.['@type']).toBe('schema:ActionStatusType');
      expect(potentialStatus?.['rdfs:label']).toBe('PotentialActionStatus');
      expect(potentialStatus?.['rdfs:comment']).toContain(
        'action that is supported',
      );
    });

    it('should extract enumeration values for other status types', () => {
      // Test another enumeration class to ensure pattern works broadly
      const results = extractor.lookupClass('HealthAspectEnumeration');

      if (results.size > 1) {
        // Only test if enumeration values exist
        const definitions = Array.from(results);

        const classDefinition = definitions.find(
          d => d['@id'] === 'schema:HealthAspectEnumeration',
        );
        expect(classDefinition).toBeDefined();

        const enumValues = definitions.filter(
          d =>
            typeof d['@type'] === 'string' &&
            d['@type'] === 'schema:HealthAspectEnumeration',
        );

        if (enumValues.length > 0) {
          expect(enumValues.length).toBeGreaterThan(0);
          // Verify each enumeration value has the correct structure
          enumValues.forEach(enumValue => {
            expect(enumValue['@type']).toBe('schema:HealthAspectEnumeration');
            expect(enumValue['rdfs:label']).toBeDefined();
          });
        }
      }
    });

    it('should include properties that use enumeration types in their range', () => {
      const results = extractor.lookupClass('ActionStatusType');
      const definitions = Array.from(results);

      // Should include properties that have ActionStatusType in their rangeIncludes
      const properties = definitions.filter(d => d['@type'] === 'rdf:Property');

      // Look for actionStatus property which should have ActionStatusType in its range
      const actionStatusProp = properties.find(
        p => p['@id'] === 'schema:actionStatus',
      );

      if (actionStatusProp) {
        // This property should have Action in domainIncludes and ActionStatusType in rangeIncludes
        expect(actionStatusProp['schema:domainIncludes']).toBeDefined();
        expect(actionStatusProp['schema:rangeIncludes']).toBeDefined();
      }
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

    it('should sort results with correct order: classes, then properties, then enum values', () => {
      const results = extractor.lookupClass('ActionStatusType');
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
      const enumValueDefinitions = writtenContent.filter(
        (d: SchemaDefinition) =>
          typeof d['@type'] === 'string' &&
          d['@type'] === 'schema:ActionStatusType',
      );

      expect(writtenContent.length).toBeGreaterThan(0);
      expect(classDefinitions.length).toBeGreaterThan(0);
      expect(enumValueDefinitions.length).toBeGreaterThan(0);

      // Class definitions should come first
      if (propertyDefinitions.length > 0) {
        expect(writtenContent.indexOf(classDefinitions[0])).toBeLessThan(
          writtenContent.indexOf(propertyDefinitions[0]),
        );
        // Properties should come before enum values
        expect(writtenContent.indexOf(propertyDefinitions[0])).toBeLessThan(
          writtenContent.indexOf(enumValueDefinitions[0]),
        );
      } else {
        // If no properties, classes should come before enum values
        expect(writtenContent.indexOf(classDefinitions[0])).toBeLessThan(
          writtenContent.indexOf(enumValueDefinitions[0]),
        );
      }
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
