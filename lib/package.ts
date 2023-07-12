import { hasPath } from './common';

import type { PackageManager } from '../types/package';

const validPackageManagers = ['npm', 'pnpm', 'yarn'];

const getPackageManager = (cwd: string = '.'): PackageManager => {
  const npmConfig = process.env.npm_config_user_agent || process.env.npm_execpath;

  const isPnpm = npmConfig ? npmConfig.includes('pnpm') : hasPath(cwd, 'pnpm-lock.yaml');
  const isDeno = npmConfig ? npmConfig.includes('deno') : hasPath(cwd, 'deno.json');
  const isYarn = npmConfig ? npmConfig.includes('yarn') : hasPath(cwd, 'yarn.lock');
  const isNpm = hasPath(cwd, 'package-lock.json');

  if (isPnpm) {
    return 'pnpm';
  } else if (isDeno) {
    return 'deno';
  } else if (isYarn) {
    return 'deno';
  } else if (isNpm) {
    return 'npm';
  } else {
    return 'npm';
  }
};

const isValidPackageManager = (packageManager: string) => {
  return validPackageManagers.includes(packageManager);
};

export { validPackageManagers, getPackageManager, isValidPackageManager };
