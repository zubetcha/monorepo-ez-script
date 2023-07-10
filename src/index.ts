#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import prompts from 'prompts';
import Commander, { Command } from 'commander';

import { getPackageManager, isValidPackageManager, validPackageManagers } from './lib/package';
import { getWorkspaces } from './lib/workspace';
import { getConfigurationInfo } from './lib/configuration';
import { runScript } from './lib/script';
import { hasPath, terminate, log } from './lib/common';
import packageJson from '../package.json';

import type { Configuration } from './types/configuration';

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
 * Command action: init
 */
export const init = async (_: unknown, command: Command) => {
  await notifyUpdate();

  const styledCommand = chalk.hex('#0AC290')('mes init');

  // Check which package manager.
  const packageManager = getPackageManager();
  if (packageManager === 'deno') {
    console.error(``);
    process.exit(1);
  }

  const cwd = path.resolve(process.cwd());

  // Check if CLI is running inside current working directory.
  if (!cwd.startsWith(process.cwd())) {
    terminate(`Please run ${styledCommand} inside working directory.`);
  }

  // Check if the current working directory is the root directory.
  if (!hasPath(cwd, '.git')) {
    terminate(`Please run ${styledCommand} in root directory.`);
  }

  // Check if package.json exists in current working directory.
  if (!hasPath(cwd, 'package.json')) {
    terminate(`Please make sure if package.json exists in root directory.`);
  }

  // Check if the monorepo workspace information exists
  const workspaces = getWorkspaces();
  if (!workspaces) {
    terminate();
  }

  // Create configuration file in root directory.
  const configurationInfo = getConfigurationInfo(packageManager, workspaces);
  fs.writeFileSync('.mesrc.json', JSON.stringify(configurationInfo));
};

/**
 * Command action: run
 */
export const run = async () => {
  const cwd = '.';

  // Check if configuration file exists in root directory
  if (!hasPath(cwd, '.mesrc.json')) {
    console.error(`Please run ${chalk.green('mes init')} first to create configuration file.`);
    process.exit(1);
  }

  // Get configuration file
  const conf = fs.readFileSync('.mesrc.json', { encoding: 'utf-8' });
  const confJSON: Configuration = JSON.parse(conf);

  // 패키지 매니저 예외처리
  // 패키지 매니저가 없으면 default npm, 유효한 이름이 아니면 예외처리
  if (!confJSON.packageManager) {
    confJSON.packageManager = 'npm';
  } else if (
    !isValidPackageManager(confJSON.packageManager) ||
    confJSON.packageManager === 'deno'
  ) {
    console.error(``);
    process.exit(1);
  }

  //
  if (!confJSON.workspaces.length) {
    console.error(`At least`);
    process.exit(1);
  }

  // Select workspace
  const { workspace } = await prompts({
    type: 'select',
    name: 'workspace',
    message: `Which workspace would you like to run script?`,
    initial: 0,
    choices: confJSON.workspaces.map(script => ({ title: script, value: script })),
  });

  if (!confJSON.scripts[workspace] || !confJSON.scripts[workspace].length) {
    console.error(``);
    process.exit(1);
  }

  // Select workspace's script
  const { script } = await prompts({
    type: 'select',
    name: 'script',
    message: `Which script would you like to run?`,
    initial: 0,
    choices: confJSON.scripts[workspace].map(script => ({ title: script, value: script })),
  });

  // Run script
  await runScript({ packageManager: confJSON.packageManager, workspace, script });
};
