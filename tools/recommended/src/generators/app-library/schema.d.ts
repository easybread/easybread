export interface AppLibraryGeneratorSchema {
  path: string;
  kind: 'next' | 'js' | 'node' | 'cdk';
}
