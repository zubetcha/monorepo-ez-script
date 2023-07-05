import fs from 'fs';
import YAML from 'yaml';

import { WORKSPACE_CONF_FILE_NAME, WORKSPACE_FIELD_NAME } from './constants';

export const getWorkspaces = () => {
  const pkg = fs.readFileSync(WORKSPACE_CONF_FILE_NAME.common, 'utf-8');
  const lernaConf = fs.existsSync(WORKSPACE_CONF_FILE_NAME.lerna)
    ? fs.readFileSync(WORKSPACE_CONF_FILE_NAME.lerna, 'utf-8')
    : '{}';
  const pnpmWorkspaceConf = fs.existsSync(WORKSPACE_CONF_FILE_NAME.pnpm)
    ? fs.readFileSync(WORKSPACE_CONF_FILE_NAME.pnpm, 'utf-8')
    : '{}';

  const pkgJSON = JSON.parse(pkg);
  const lernaJSON = JSON.parse(lernaConf);
  const pnpmWorkspaceJSON = YAML.parse(pnpmWorkspaceConf);

  const workspaces =
    pkgJSON[WORKSPACE_FIELD_NAME.common] ||
    lernaJSON[WORKSPACE_FIELD_NAME.lerna] ||
    pnpmWorkspaceJSON[WORKSPACE_FIELD_NAME.pnpm];

  return workspaces;
};
