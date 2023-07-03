#!/usr/bin/env node

import Commander from 'commander';
import chalk from 'chalk';
import { detect } from 'detect-package-manager';

import { getPackageManager } from './lib/package';
import packageJson from '../package.json';

let packageManager = '';

const program = new Commander.Command(packageJson.name)
  .version(packageJson.version)
  .arguments('<project-directory>')
  .usage(`${chalk.green('<project-directory>')} [options]`)
  .action(value => console.log(`${chalk.green(getPackageManager())} [options]`))
  .allowUnknownOption()
  .parse(process.argv);

// const packageManager = !!program.useNpm
//   ? 'npm'
//   : !!program.usePnpm
//   ? 'pnpm'
//   : !!program.useYarn
//   ? 'yarn'
//   : getPackageManager();

console.log(program);

detect().then(pm => (packageManager = pm));

/**
 * 현재 버전이 최신 버전이 아닌 경우
 */
const notifyUpdate = async () => {
  const { default: updateNotifier } = await import('update-notifier');
  const notifier = updateNotifier({ pkg: packageJson });

  if (notifier.update && notifier.update.latest !== packageJson.version) {
    notifier.notify({
      defer: false,
      isGlobal: false,
      message:
        `New ${notifier.update.type} version available: ${chalk.dim(
          '{currentVersion}',
        )}${chalk.reset(' → ')}${
          notifier.update.type === 'major'
            ? chalk.red('{latestVersion}')
            : notifier.update.type === 'minor'
            ? chalk.yellow('{latestVersion}')
            : chalk.green('{latestVersion}')
        }\n` +
        `Run ${chalk.cyan('{updateCommand}')} to update\n` +
        `${chalk.dim.underline(`${packageJson.homepage ?? ''}/releases`)}`,
    });
  }
};
