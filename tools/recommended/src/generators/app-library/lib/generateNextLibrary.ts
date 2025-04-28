import { Tree, joinPathFragments } from '@nx/devkit';
import { Linter } from '@nx/eslint';
import { libraryGenerator as nextLibGenerator } from '@nx/next';

export async function generateNextLibrary(
  tree: Tree,
  name: string,
  path: string,
) {
  await nextLibGenerator(tree, {
    name,
    directory: path,
    bundler: 'vite',
    linter: Linter.EsLint,
    style: 'tailwind',
    unitTestRunner: 'vitest',
    component: false,
    strict: true,
    skipPackageJson: true,
    publishable: false,
  });

  tree.delete(joinPathFragments(path, 'package.json'));
}
