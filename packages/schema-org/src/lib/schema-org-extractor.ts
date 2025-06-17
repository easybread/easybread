import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

// Helper to get schema path that works in both CommonJS and ES modules
function getDefaultSchemaPath(): string {
  // Try __dirname first (CommonJS)
  if (typeof __dirname !== 'undefined') {
    return join(__dirname, '../raw-definitions/schema.org.current.jsonld');
  }

  // Fallback for ES modules - use working directory relative path
  return join(
    process.cwd(),
    'packages/schema-org/raw-definitions/schema.org.current.jsonld',
  );
}

/**
 * Schema.org JSON-LD file content
 */
interface SchemaOrgJsonldFile {
  '@context': string;
  '@graph': SchemaDefinition[];
}

/**
 * Schema.org JSON-LD individual schema definition
 */
interface SchemaDefinition {
  '@id': string;
  '@type': string | string[];
  'rdfs:comment'?: string;
  'rdfs:label'?: string;
  'rdfs:subClassOf'?: { '@id': string };
  'schema:domainIncludes'?: { '@id': string } | { '@id': string }[];
  'schema:rangeIncludes'?: { '@id': string } | { '@id': string }[];
  'schema:isPartOf'?: { '@id': string };
  'schema:source'?: { '@id': string } | { '@id': string }[];
  'schema:contributor'?: { '@id': string } | { '@id': string }[];
  'schema:supersededBy'?: { '@id': string };
  'schema:inverseOf'?: { '@id': string };
  'owl:equivalentClass'?: { '@id': string };
  [key: string]: unknown;
}

/**
 * Efficient schema.org extractor using modern TypeScript and Node.js features
 */
export class SchemaOrgExtractor {
  /**
   * Check if a schema definition is an enumeration value
   * Enumeration values have @type that points to an enumeration class
   */
  static isEnumerationValue(definition: SchemaDefinition): boolean {
    return (
      typeof definition['@type'] === 'string' &&
      definition['@type'].startsWith('schema:') &&
      definition['@type'] !== 'rdf:Property' &&
      definition['@type'] !== 'rdfs:Class'
    );
  }

  static isClass(definition: SchemaDefinition): boolean {
    return (
      definition['@type'] === 'rdfs:Class' ||
      (Array.isArray(definition['@type']) &&
        definition['@type'].includes('rdfs:Class'))
    );
  }

  static isProperty(definition: SchemaDefinition): boolean {
    return definition['@type'] === 'rdf:Property';
  }

  private readonly schemaFilePath: string;
  private readonly definitionsMap = new Map<string, SchemaDefinition>();
  private readonly classToDomainPropsMap = new Map<
    string,
    Set<SchemaDefinition>
  >();
  private readonly classToEnumValuesMap = new Map<
    string,
    Set<SchemaDefinition>
  >();

  constructor(schemaFilePath: string) {
    this.schemaFilePath = schemaFilePath;
    this.buildIndex();
  }

  /**
   * Load and index all schema definitions for efficient lookups
   */
  private buildIndex(): void {
    for (const definition of this.readDefinitions()) {
      // Index all definitions by @id for O(1) lookups
      this.definitionsMap.set(definition['@id'], definition);

      // Build reverse index: class -> properties that have it in domainIncludes
      if (
        definition['@type'] === 'rdf:Property' &&
        definition['schema:domainIncludes']
      ) {
        const domainIncludes = definition['schema:domainIncludes'];
        const domains = Array.isArray(domainIncludes)
          ? domainIncludes
          : [domainIncludes];

        for (const domain of domains) {
          const classId = domain['@id'];
          if (!this.classToDomainPropsMap.has(classId)) {
            this.classToDomainPropsMap.set(classId, new Set());
          }
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          this.classToDomainPropsMap.get(classId)!.add(definition);
        }
      }

      // Build reverse index: enumeration class -> enumeration values
      if (SchemaOrgExtractor.isEnumerationValue(definition)) {
        const enumClassId = definition['@type'] as string;
        if (!this.classToEnumValuesMap.has(enumClassId)) {
          this.classToEnumValuesMap.set(enumClassId, new Set());
        }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.classToEnumValuesMap.get(enumClassId)!.add(definition);
      }
    }
  }

  /**
   * Extract class definition, all properties that have the class in their domainIncludes,
   * and all enumeration values that have the class as their @type
   */
  lookupClass(className: string): Set<SchemaDefinition> {
    const results = new Map<string, SchemaDefinition>();
    const classId = className.startsWith('schema:')
      ? className
      : `schema:${className}`;

    const classDefinition = this.definitionsMap.get(classId);

    if (!classDefinition) {
      throw new Error(
        `Class ${className} not found in schema.org.current.jsonld`,
      );
    }

    results.set(classId, classDefinition);

    // Add all properties that have this class in their domainIncludes
    const domainProperties = this.classToDomainPropsMap.get(classId);

    if (domainProperties) {
      for (const property of domainProperties) {
        results.set(property['@id'], property);
      }
    }

    // Add all enumeration values that have this class as their @type
    const enumValues = this.classToEnumValuesMap.get(classId);

    if (enumValues) {
      for (const enumValue of enumValues) {
        results.set(enumValue['@id'], enumValue);
      }
    }

    return new Set(results.values());
  }

  /**
   * Get statistics about the extraction
   */
  getStats(): {
    totalDefinitions: number;
    totalClasses: number;
    totalProperties: number;
    totalEnumValues: number;
  } {
    const classes = new Set<string>();
    const properties = new Set<string>();
    const enumValues = new Set<string>();

    for (const [id, definition] of this.definitionsMap) {
      if (SchemaOrgExtractor.isClass(definition)) {
        classes.add(id);
      } else if (definition['@type'] === 'rdf:Property') {
        properties.add(id);
      } else if (SchemaOrgExtractor.isEnumerationValue(definition)) {
        enumValues.add(id);
      }
    }

    return {
      totalDefinitions: this.definitionsMap.size,
      totalClasses: classes.size,
      totalProperties: properties.size,
      totalEnumValues: enumValues.size,
    };
  }

  private readDefinitions(): SchemaDefinition[] {
    const schemaContent = readFileSync(this.schemaFilePath, 'utf-8');
    const schemaData = JSON.parse(schemaContent) as SchemaOrgJsonldFile;
    if (!schemaData['@graph']) {
      throw new Error('No @graph in schema.org.current.jsonld');
    }
    return schemaData['@graph'];
  }
}

/**
 * Write extraction results to a JSON file
 */
export function writeResults(
  results: Set<SchemaDefinition>,
  destinationPath: string,
): void {
  const resultsArray = Array.from(results);

  // Sort results: class definitions first, then properties, then enumeration values, all alphabetically
  resultsArray.sort((a, b) => {
    const aIsClass = SchemaOrgExtractor.isClass(a);
    const bIsClass = SchemaOrgExtractor.isClass(b);

    const aIsProperty = a['@type'] === 'rdf:Property';
    const bIsProperty = b['@type'] === 'rdf:Property';

    const aIsEnumValue = SchemaOrgExtractor.isEnumerationValue(a);
    const bIsEnumValue = SchemaOrgExtractor.isEnumerationValue(b);

    // Sort order: classes first, then properties, then enum values
    if (aIsClass && !bIsClass) return -1;
    if (!aIsClass && bIsClass) return 1;

    if (aIsProperty && !bIsProperty) return -1;
    if (!aIsProperty && bIsProperty) return 1;

    if (aIsEnumValue && !bIsEnumValue) return -1;
    if (!aIsEnumValue && bIsEnumValue) return 1;

    return a['@id'].localeCompare(b['@id']);
  });

  const jsonContent = JSON.stringify(resultsArray, null, 2) + '\n';
  writeFileSync(destinationPath, jsonContent, 'utf-8');
}

/**
 * Convenience function to extract a class and write results
 */
export function extractClassToFile(
  schemaFilePath: string,
  className: string,
  outputPath: string,
): void {
  const extractor = new SchemaOrgExtractor(schemaFilePath);
  const results = extractor.lookupClass(className);
  writeResults(results, outputPath);
}

/**
 * Main lookup function for direct usage
 */
export function lookupClass(
  className: string,
  schemaFilePath?: string,
): Set<SchemaDefinition> {
  const filePath = schemaFilePath ?? getDefaultSchemaPath();

  const extractor = new SchemaOrgExtractor(filePath);
  return extractor.lookupClass(className);
}

// Export types for external usage
export type { SchemaDefinition };
