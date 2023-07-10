#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';

import packageJson from '../../package.json';
import { init, run } from '../index';

const program = new Command();

program.name('mes').description(packageJson.description).version(packageJson.version);

program.command('init').description('Create configuration file in root directory').action(init);

program.command('run').description('Select workspace and run script').action(run);

program.parse(process.argv);
