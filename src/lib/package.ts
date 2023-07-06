import validate from 'validate-npm-package-name';
import { hasPath } from './common';
import { detect } from 'detect-package-manager';
import execa from 'execa';

import type { PackageManager } from '../types/package';

export function validatePackageName(name: string): {
  valid: boolean;
  problems?: string[];
} {
  const nameValidation = validate(name);

  if (nameValidation.validForNewPackages) {
    return { valid: true };
  }

  return {
    valid: false,
    problems: [...(nameValidation.errors || []), ...(nameValidation.warnings || [])],
  };
}

export const getPackageManager = (cwd: string = '.'): PackageManager => {
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
