import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { readJson, readProjectConfiguration, Tree } from '@nx/devkit';

import { packageGenerator } from './generator';
import type { PackageGeneratorSchema } from './schema';

// TODO: research the error that happens only on the Github Actions and unskip.
//   TypeError: performance.mark is not a function
//         at loadNxPlugins (../../node_modules/.pnpm/nx@19.6.2_@swc-node+register@1.9.2_@swc+core@1.5.29_@swc+helpers@0.5.12__@swc+types@0.1.12_ty_k6mclr5atum6icmfddmydcitj4/node_modules/nx/src/project-graph/plugins/internal-api.js:90:17)
//         at buildProjectGraphAndSourceMapsWithoutDaemon (../../node_modules/.pnpm/nx@19.6.2_@swc-node+register@1.9.2_@swc+core@1.5.29_@swc+helpers@0.5.12__@swc+types@0.1.12_ty_k6mclr5atum6icmfddmydcitj4/node_modules/nx/src/project-graph/project-graph.js:78:71)
//         at createProjectGraphAndSourceMapsAsync (../../node_modules/.pnpm/nx@19.6.2_@swc-node+register@1.9.2_@swc+core@1.5.29_@swc+helpers@0.5.12__@swc+types@0.1.12_ty_k6mclr5atum6icmfddmydcitj4/node_modules/nx/src/project-graph/project-graph.js:208:31)
//         ...
describe.skip('package generator', () => {
  const EXPECTED_RELEASE_CONFIGURATION = {
    version: {
      generatorOptions: {
        currentVersionResolver: 'git-tag',
        packageRoot: 'dist/{projectRoot}',
      },
    },
  };

  let tree: Tree;

  beforeEach(async () => {
    tree = createTreeWithEmptyWorkspace();
  });

  describe('without directory', () => {
    const options: PackageGeneratorSchema = {
      name: 'my-package',
      directory: '',
    };

    it(`should create a project "my-package" at packages/my-package`, async () => {
      await packageGenerator(tree, options);
      const config = readProjectConfiguration(tree, 'my-package');
      expect(config).toBeDefined();
    });

    it(`must set package.json name to @easybread/my-package`, async () => {
      await packageGenerator(tree, options);
      const packageJson = readJson(tree, 'packages/my-package/package.json');
      expect(packageJson.name).toBe('@easybread/my-package');
    });

    it(`should be publishable`, async () => {
      await packageGenerator(tree, options);
      const config = readProjectConfiguration(tree, 'my-package');
      expect(config.release).toEqual(EXPECTED_RELEASE_CONFIGURATION);
    });
  });

  describe('with directory', () => {
    const options: PackageGeneratorSchema = {
      name: 'my-package',
      directory: 'sub/domain/my-package',
    };

    it(`should create a project "sub-domain-my-package" at packages/sub/domain/my-package`, async () => {
      await packageGenerator(tree, options);
      const config = readProjectConfiguration(tree, 'sub-domain-my-package');
      expect(config).toBeDefined();
    });

    it(`must set package.json name to @easybread/my-package`, async () => {
      await packageGenerator(tree, options);
      const packageJson = readJson(
        tree,
        'packages/sub/domain/my-package/package.json'
      );
      expect(packageJson.name).toBe('@easybread/my-package');
    });

    it(`should be publishable`, async () => {
      await packageGenerator(tree, options);
      const config = readProjectConfiguration(tree, 'sub-domain-my-package');
      expect(config.release).toEqual(EXPECTED_RELEASE_CONFIGURATION);
    });
  });
});
