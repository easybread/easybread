import { type Tree, joinPathFragments } from '@nx/devkit';
import { Linter } from '@nx/eslint';
import { libraryGenerator } from '@nx/js';

export async function generateJsLibrary(
  tree: Tree,
  name: string,
  path: string,
) {
  await libraryGenerator(tree, {
    name,
    directory: path,
    linter: Linter.EsLint,
    unitTestRunner: 'vitest',
    strict: true,
    bundler: 'vite',
    minimal: true,
    skipPackageJson: true,
    publishable: false,
  });

  tree.delete(joinPathFragments(path, 'package.json'));
}
