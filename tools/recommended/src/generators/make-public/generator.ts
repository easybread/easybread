import {
  formatFiles,
  getProjects,
  joinPathFragments,
  readJson,
  Tree,
  writeJson,
} from '@nx/devkit';
import { MakePublicGeneratorSchema } from './schema';

export async function makePublicGenerator(
  tree: Tree,
  _options: MakePublicGeneratorSchema
) {
  const projects = getProjects(tree);

  projects.forEach((project) => {
    if (project.projectType !== 'library') return;
    if (!project.root.startsWith('packages')) return;

    const packageJsonPath = joinPathFragments(project.root, 'package.json');

    if (!tree.exists(packageJsonPath)) return;

    const packageJson = readJson(tree, packageJsonPath) as {
      name: string;
      publishConfig?: { access: string };
    };

    if (!packageJson.name.startsWith('@easybread/')) return;
    if (packageJson.publishConfig?.access === 'public') return;

    packageJson.publishConfig = { access: 'public' };
    writeJson(tree, packageJsonPath, packageJson);
  });

  await formatFiles(tree);
}

export default makePublicGenerator;
