#!/usr/bin/env node

import Commander from 'commander';
import chalk from 'chalk';
import path from 'path';
import fs from 'fs';

import type { Command } from 'commander';

import { getPackageManager } from './lib/package';
import { getWorkspaces } from './lib/workspace';
import { getConfiguration } from './lib/configuration';
import { hasPath } from './lib/common';
import packageJson from '../package.json';

/**
 * Notify if the current version is out of date.
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
  console.log(`mes ${chalk.green(command.name())}`);

  await notifyUpdate();

  // Check which package manager.
  const packageManager = getPackageManager();
  if (packageManager === 'deno') {
    console.error(``);
    process.exit(1);
  }

  const cwd = path.resolve(process.cwd());

  // Check if CLI is running inside current working directory.
  if (!cwd.startsWith(process.cwd())) {
    console.error(``);
    process.exit(1);
  }

  // Check if the current working directory is the root directory.
  if (!hasPath(cwd, '.git')) {
    console.error(`Please run CLI in root directory`);
    process.exit(1);
  }

  // Check if package.json exists in current working directory.
  if (!hasPath(cwd, 'package.json')) {
    console.error(`Please ensure that package.json exists in root directory`);
    process.exit(1);
  }

  // Check if the monorepo workspace information exists
  const workspaces = getWorkspaces();
  if (!workspaces) {
    console.error(`Please...`);
    process.exit(1);
  }

  // Create configuration file in root directory.
  const configuration = getConfiguration(packageManager, workspaces);
  fs.writeFileSync('mes.json', JSON.stringify(configuration));
};

/**
 * command action: run
 */
export const run = () => {
  // 루트에 있는 config 파일 로드 및 파싱
  // 패키지 매니저 확인
  // 스크립트 실행할 워크스페이스 select
  // 실행할 스크립트 select
  // 스크립트 실행
};
