import fs from 'fs';
import YAML from 'yaml';

const CONFIGURATION = {
  common: {
    file: 'package.json',
    field: 'workspaces',
  },
  pnpm: {
    file: 'pnpm-workspace.yaml',
    field: 'packages',
  },
  lerna: {
    file: 'lerna.json',
    field: 'packages',
  },
};

const { common, pnpm, lerna } = CONFIGURATION;

export const getWorkspaces = () => {
  const pkg = fs.readFileSync(common.file, 'utf-8');
  const lernaConf = fs.existsSync(lerna.file) ? fs.readFileSync(lerna.file, 'utf-8') : '{}';
  const pnpmWorkspaceConf = fs.existsSync(pnpm.file) ? fs.readFileSync(pnpm.file, 'utf-8') : '{}';

  const pkgJSON = JSON.parse(pkg);
  const lernaJSON = JSON.parse(lernaConf);
  const pnpmWorkspaceJSON = YAML.parse(pnpmWorkspaceConf);

  return pkgJSON[common.field] || lernaJSON[lerna.field] || pnpmWorkspaceJSON[pnpm.field];
};
