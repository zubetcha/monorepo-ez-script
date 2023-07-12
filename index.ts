import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import prompts from 'prompts';

import { getPackageManager, isValidPackageManager, validPackageManagers } from './lib/package';
import { getWorkspaces, CONFIGURATION } from './lib/workspace';
import { getConfigurationInfo, createConfiguration } from './lib/configuration';
import { runScript } from './lib/script';
import { hasPath, terminate, log, customChalk } from './lib/common';
import packageJson from './package.json';

import type { Configuration } from './types/configuration';

const { green, blue, cyan, yellow } = customChalk;
const { common, pnpm, lerna } = CONFIGURATION;

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
export const init = async () => {
  await notifyUpdate();

  const styledCommand = green('mes init');

  // Check which package manager.
  const packageManager = getPackageManager();
  if (packageManager === 'deno') {
    terminate(`${green('deno')} is not supported.`);
  }

  const cwd = path.resolve(process.cwd());

  // Check if CLI is running inside current working directory.
  if (!cwd.startsWith(process.cwd())) {
    terminate(`Run ${styledCommand} inside working directory.`);
  }

  // Check if the current working directory is the root directory.
  if (!hasPath(cwd, '.git')) {
    terminate(`Run ${styledCommand} in root directory.`);
  }

  // Check if package.json exists in current working directory.
  if (!hasPath(cwd, 'package.json')) {
    terminate(`Make sure that package.json exists in root directory.`);
  }

  // Check if the monorepo workspace information exists
  const workspaces = getWorkspaces();
  if (!workspaces) {
    log('');
    log('Could not found workspaces information in current working directory.');
    log('');
    log(`If using ${green('yarn')} or ${green('npm')},`);
    log(`include ${blue(common.field)} field in root ${blue(common.file)}`);
    log('');
    log(`Else if using ${green('pnpm')},`);
    log(`include ${blue(pnpm.field)} field in root ${blue(pnpm.file)}`);
    log('');
    log(`Else if using ${green('lerna')} and want to use configuration file of lerna,`);
    log(`include ${blue(lerna.field)} field in root ${blue(lerna.file)}`);

    terminate();
  }

  // Create configuration file in root directory.
  log('');
  log('> Collecting workspaces and scripts.');

  const configurationInfo = getConfigurationInfo(packageManager, workspaces);

  log('');
  log(`> Creating configuration file.`);

  createConfiguration(configurationInfo);

  log('');
  log(`Complete! Check ${yellow('.mesrc.json')}`);
};

/**
 * Command action: run
 */
export const run = async () => {
  const cwd = '.';

  // Check if configuration file exists in root directory
  if (!hasPath(cwd, '.mesrc.json')) {
    log('');
    log('Not found configuration file.');
    log(`Run ${green('mes init')} first to create configuration file.`);
    log('');

    await init();
  }

  // Get configuration file from root
  const configurationFile = fs.readFileSync('.mesrc.json', { encoding: 'utf-8' });
  let { packageManager, workspaces, scripts }: Partial<Configuration> =
    JSON.parse(configurationFile);

  if (!packageManager) {
    log('');
    log(`Not found package manager.`);
    log(`Apply ${cyan('npm')} by default.`);
    log('');

    packageManager = 'npm';
  }

  /**
   * Check if configuration file has required information fully.
   */
  if (typeof packageManager !== 'string') {
    return terminate(
      `${cyan('packageManager')} should be one of ${yellow(validPackageManagers.join(', '))}`,
    );
  }

  if (!isValidPackageManager(packageManager) || packageManager === 'deno') {
    log('');
    log(`${green(packageManager)} is not supported.`);
    log(`Supported package managers are ${yellow(validPackageManagers.join(', '))}.`);
    return terminate();
  }

  if (!workspaces) {
    return terminate(`Make sure ${green('workspaces')} field exists in configuration file.`);
  }

  if (!(workspaces instanceof Array)) {
    return terminate(`Type of ${green('workspace')} should be ${yellow('Array<string>')}`);
  }

  if (!workspaces.length) {
    return terminate(`workspaces should have one workspace at least.`);
  }

  if (!scripts) {
    return terminate(`Make sure ${green('scripts')} field exists in configuration file.`);
  }

  // Select workspace
  const { workspace } = await prompts(
    {
      type: 'select',
      name: 'workspace',
      message: `Which ${cyan('workspace')} would you like to run script?`,
      initial: 0,
      choices: workspaces.map(script => ({ title: script, value: script })),
    },
    { onCancel: () => terminate('Exiting.') },
  );

  if (!scripts[workspace]) {
    terminate(`${cyan(workspace)} doesn't exist in scripts as key.`);
  } else if (!scripts[workspace].length) {
    terminate(`Scripts of ${cyan(workspace)} don't have any script.`);
  }

  // Select workspace's script
  const { script } = await prompts(
    {
      type: 'select',
      name: 'script',
      message: `Which ${cyan('script')} would you like to run?`,
      initial: 0,
      choices: scripts[workspace].map(script => ({ title: script, value: script })),
    },
    { onCancel: () => terminate('Exiting.') },
  );

  // Run script
  await runScript({ packageManager, workspace, script });
};
