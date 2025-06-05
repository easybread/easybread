import { type Tree, joinPathFragments } from '@nx/devkit';
import { Linter } from '@nx/eslint';
import { libraryGenerator } from '@nx/js';

export async function generateNodeLibrary(
  tree: Tree,
  name: string,
  path: string,
) {
  await libraryGenerator(tree, {
    name,
    directory: path,
    linter: Linter.EsLint,
    unitTestRunner: 'vitest',
    testEnvironment: 'node',
    strict: true,
    bundler: 'esbuild',
    minimal: true,
    skipPackageJson: true,
    publishable: false,
  });

  tree.delete(joinPathFragments(path, 'package.json'));
}
