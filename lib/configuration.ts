import { globSync } from 'glob';
import fs from 'fs';
import ProgressBar from 'progress';
import { customChalk } from './common';

import type { PackageManager } from '../types/package';
import type { Configuration } from '../types/configuration';

const { cyan } = customChalk;

/**
 * Get Configuration Information like package manager, workspace name, scripts.
 *
 * @param packageManager Package manager
 * @param workspaces
 * @returns
 */
const getConfigurationInfo = (
  packageManager: PackageManager,
  workspaces: string[],
): Configuration => {
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

  const workpaceNames: Set<string> = new Set();
  const scripts: Record<string, string[]> = {};

  const packageJsonPaths = globSync(workspacePatterns, {
    ignore: ignores,
    withFileTypes: true,
  });

  const bar = new ProgressBar('[:bar] :current/:total :percent', {
    total: packageJsonPaths.length,
    width: 20,
    complete: '=',
    incomplete: ' ',
  });

  packageJsonPaths.forEach(path => {
    bar.tick();

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
    workspaces: [...workpaceNames],
    scripts,
  };
};

const createConfiguration = (configurationInfo: Configuration) => {
  fs.writeFileSync('.mesrc.json', JSON.stringify(configurationInfo, null, 2));
};

export { getConfigurationInfo, createConfiguration };
