import { globSync } from 'glob';
import fs from 'fs';

import type { PackageManager } from '../types/package';

/**
 * Get Configuration Information like package manager, workspace name, scripts.
 *
 * @param packageManager Package manager
 * @param workspaces
 * @returns
 */
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

  const workpaceNames = new Set();
  const scripts: Record<string, string[]> = {};

  const packageJsonPaths = globSync(workspacePatterns, {
    ignore: ignores,
    withFileTypes: true,
  });

  packageJsonPaths.forEach(path => {
    const packageJsonFile = fs.readFileSync(path.relative(), { encoding: 'utf-8' });
    const packageJson = JSON.parse(packageJsonFile);
    const packageName = packageManager === 'npm' ? path.parent?.name : packageJson.name;

    if (packageName) {
      workpaceNames.add(packageName);
      scripts[packageName] = Object.keys(packageJson.scripts);
    }
  });

  return {
    packageManager,
    workspaceNames: [...workpaceNames],
    scripts,
  };
};
