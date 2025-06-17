#!/usr/bin/env node
import { resolve } from 'node:path';

import { SchemaOrgExtractor, writeResults } from '../src';

/**
 * CLI script to extract schema.org classes
 */
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(`
Usage: node extract-class.js <className> [outputPath]

Examples:
  node extract-class.js Person
  node extract-class.js Occupation ./output/Occupation.json
  node extract-class.js DateTime
  node extract-class.js EmployeeRole

The script will extract the class definition and all properties that have
the class in their domainIncludes.
    `);
    process.exit(1);
  }

  const className = args[0];
  const outputPath = args[1] || `./raw-definitions/by-class/${className}.json`;
  const schemaPath = resolve('./raw-definitions/schema.org.current.jsonld');

  try {
    console.log(`🔍 Extracting class: ${className}`);
    console.log(`📁 Schema file: ${schemaPath}`);
    console.log(`💾 Output path: ${outputPath}`);

    const extractor = new SchemaOrgExtractor(schemaPath);
    const stats = extractor.getStats();

    console.log(`📊 Schema stats:`, stats);

    const results = extractor.lookupClass(className);

    if (results.size === 0) {
      console.log(`❌ No definitions found for class: ${className}`);
      process.exit(1);
    }

    console.log(`✅ Found ${results.size} definitions for ${className}`);

    // Show what was found
    const definitions = Array.from(results);
    const classDefinitions = definitions.filter(
      d =>
        d['@type'] === 'rdfs:Class' ||
        (Array.isArray(d['@type']) && d['@type'].includes('rdfs:Class')),
    );
    const propertyDefinitions = definitions.filter(
      d => d['@type'] === 'rdf:Property',
    );

    console.log(`  📋 Class definitions: ${classDefinitions.length}`);
    console.log(`  🔧 Property definitions: ${propertyDefinitions.length}`);

    if (classDefinitions.length > 0) {
      console.log(
        `  📝 Classes: ${classDefinitions.map(d => d['@id']).join(', ')}`,
      );
    }

    if (propertyDefinitions.length > 0) {
      console.log(
        `  🏷️  Properties: ${propertyDefinitions
          .slice(0, 5)
          .map(d => d['@id'])
          .join(
            ', ',
          )}${propertyDefinitions.length > 5 ? ` ... and ${propertyDefinitions.length - 5} more` : ''}`,
      );
    }

    writeResults(results, outputPath);
    console.log(`💾 Results written to: ${outputPath}`);
  } catch (error) {
    console.error(`❌ Error extracting class ${className}:`, error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { main };
