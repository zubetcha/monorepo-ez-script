import { glob, sync, globSync } from 'glob';
import fs from 'fs';

import type { PackageManager } from '../types/package';

// pnpm/yarn은 workspace의 package.json['name']
// npm은 yarn 또는 디렉토리 이름

export const getConfiguration = (packageManager: PackageManager, workspaces: string[]) => {
  let workspacePatterns: string[] = workspaces
    .filter(workspace => !workspace.startsWith('!'))
    .map(workspace => {
      if (workspace.endsWith('/*')) {
        return workspace + '*/package.json';
      } else {
        return workspace + '/package.json';
      }
    });
  const ignores: string[] = workspaces
    .filter(workspace => workspace.startsWith('!'))
    .map(workspace => workspace.slice(1));

  const workspaceNames: string[] = [];
  const scripts: Record<string, string[]> = {};

  if (packageManager === 'npm') {
  } else {
    const packageJsonsPath = globSync(workspacePatterns, {
      ignore: ignores,
    });

    console.log(packageJsonsPath);

    packageJsonsPath.forEach(path => {
      const packageJsonFile = fs.readFileSync(path, { encoding: 'utf-8' });
      const packageJson = JSON.parse(packageJsonFile);
      const packageName = packageJson.name;

      console.log(packageJson);

      workspaceNames.push(packageName);
      scripts[packageName] = Object.keys(packageJson.scripts);
    });
  }

  return {
    packageManager,
    workspaceNames,
    scripts,
  };
};
