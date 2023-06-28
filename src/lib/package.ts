import validate from 'validate-npm-package-name';
import type { PackageManager } from '../types/package';

export function getPackageManager(): PackageManager {
  const npmConfig = process.env.npm_config_user_agent || process.env.npm_execpath || '';

  switch (true) {
    case npmConfig.includes('yarn'):
      return 'yarn';
    case npmConfig.includes('pnpm'):
      return 'pnpm';
    case npmConfig.includes('deno'):
      return 'deno';
    default:
      return 'npm';
  }
}

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
