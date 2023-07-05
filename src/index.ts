#!/usr/bin/env node

import Commander from 'commander';
import chalk from 'chalk';
import { detect } from 'detect-package-manager';
import path from 'path';
import fs from 'fs';
import YAML from 'yaml';

import type { Command } from 'commander';

import { getPackageManager } from './lib/package';
import { getWorkspaces } from './lib/workspace';
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

/**
 * command action: init
 */
export const init = async (_: unknown, command: Command) => {
  await notifyUpdate();

  console.log(`mes ${chalk.green(command.name())}`);
  console.log('Current Working Directory resolved', path.resolve(process.cwd()));
  console.log('Current Working Directory', process.cwd());

  const cwd = path.resolve(process.cwd());

  // cwd 밖에서 실행되고 있지는 않은지 확인 및 예외처리
  if (!cwd.startsWith(process.cwd())) {
    console.error(``);
    process.exit(1);
  }

  // 현재 위치가 root인지 확인 및 예외처리
  // cwd에 git이 있는지 확인
  if (!fs.existsSync('.git')) {
    console.error(`Please run CLI at root directory`);
    process.exit(1);
  }

  // 현재 위치에 package.json이 있는지 확인 및 예외처리
  if (!fs.existsSync('package.json')) {
    console.error(`Please ensure that package.json exists in root directory`);
    process.exit(1);
  }

  // package.json에 workspaces 필드가 있는지 확인 및 예외처리
  const workspaces = getWorkspaces();
  if (!workspaces) {
    console.error(`Please...`);
    process.exit(1);
  }

  // workspace 이름 및 각 workspace package.json의 scripts 정보 수집
  // glob 패턴...

  // config 파일 생성
  const info = {
    workspaces,
  };

  fs.writeFileSync('mes.json', JSON.stringify(info));
};
