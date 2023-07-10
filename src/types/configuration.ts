import type { PackageManager } from './package';

export type Configuration = {
  packageManager: PackageManager;
  workspaces: string[];
  scripts: Record<string, string[]>;
};
