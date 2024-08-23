import { Tree } from '@nx/devkit';
import { PackageGeneratorSchema } from './schema';
import { libraryGenerator } from '@nx/js';
import { Linter } from '@nx/eslint';

export async function packageGenerator(
  tree: Tree,
  options: PackageGeneratorSchema
) {
  const { name, directory } = options;

  const projectRoot = `packages/${directory || name}`;

  const projectName = directory ? directory.replace(/\//g, '-') : name;

  await libraryGenerator(tree, {
    name: projectName,
    directory: projectRoot,
    bundler: 'rollup',
    publishable: true,
    importPath: `@easybread/${name}`,
    unitTestRunner: 'jest',
    linter: Linter.EsLint,
    projectNameAndRootFormat: 'as-provided',
  });
}

export default packageGenerator;
