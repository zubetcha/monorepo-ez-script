import { spawn } from 'child_process';
import type { ValidPackageManager } from '../types/package';

const runScript = ({
  packageManager,
  workspace,
  script,
}: {
  packageManager: ValidPackageManager;
  workspace: string;
  script: string;
}): Promise<void> => {
  return new Promise((resolve, reject) => {
    let args: string[] = [];
    const command = packageManager;
    const usePnpm = packageManager === 'pnpm';
    const useYarn = packageManager === 'yarn';

    if (usePnpm) {
      args = ['--filter'];
      args.push(`"${workspace}"`, script);
    } else if (useYarn) {
      args = ['workspace'];
      args.push(workspace, script);
    } else {
      args = ['run'];
      args.push(script, `--workspace=${workspace}`);
    }

    const child = spawn(command, args, { stdio: 'inherit', env: { ...process.env } });

    child.on('close', code => {
      if (code !== 0) {
        reject({ command: `${command} ${args.join(' ')}` });
        return;
      }
      resolve();
    });
  });
};

export { runScript };
