import { Tree } from '@nx/devkit';

import { generateJsLibrary } from './lib/generateJsLibrary';
import { generateNextLibrary } from './lib/generateNextLibrary';
import { generateNodeLibrary } from './lib/generateNodeLibrary';
import { AppLibraryGeneratorSchema } from './schema';

export async function appLibraryGenerator(
  tree: Tree,
  options: AppLibraryGeneratorSchema,
) {
  const { path, kind } = options;

  if (!path.startsWith('apps')) {
    throw new Error('Path root must the the com directory');
  }

  const name = path.split('/').slice(1).join('-');

  switch (kind) {
    case 'next':
      return generateNextLibrary(tree, name, path);

    case 'js':
      return generateJsLibrary(tree, name, path);

    case 'node':
      return generateNodeLibrary(tree, name, path);

    default:
      throw new Error(`Unknown kind: ${kind}`);
  }
}

export default appLibraryGenerator;
