import validate from 'validate-npm-package-name';

type PackageManager = 'npm' | 'pnpm' | 'yarn';

export const getPackageManager = (): PackageManager => {
  const npmConfig = process.env.npm_config_user_agent || process.env.npm_execpath || '';

  switch (true) {
    case npmConfig.includes('yarn'):
      return 'yarn';
    case npmConfig.includes('pnpm'):
      return 'pnpm';
    default:
      return 'npm';
  }
};

export const validatePackageName = (
  name: string,
): {
  valid: boolean;
  problems?: string[];
} => {
  const nameValidation = validate(name);

  if (nameValidation.validForNewPackages) {
    return { valid: true };
  }

  return {
    valid: false,
    problems: [...(nameValidation.errors || []), ...(nameValidation.warnings || [])],
  };
};
