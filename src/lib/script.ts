import type { ValidPackageManager } from '../types/package';

const getWorkspaceCli = ({
  packageManager,
  workspace,
  script,
}: {
  packageManager: ValidPackageManager;
  workspace: string;
  script: string;
}) => {
  const pacakgeManagerCli = {
    pnpm: ``,
    yarn: `yarn workspace`,
    npm: ``,
  };
};

const runScript = ({
  packageManager,
  workspace,
  script,
}: {
  packageManager: ValidPackageManager;
  workspace: string;
  script: string;
}) => {
  // const runningScriptCli =
};

export { runScript };
