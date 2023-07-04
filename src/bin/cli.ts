#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';

import packageJson from '../../package.json';
import { init } from '../index';

const program = new Command();

program.name(packageJson.name).description(packageJson.description).version(packageJson.version);

program.command('init').description('Create configuration file in root directory').action(init);

program
  .command('script')
  .description('Select child package and run script')
  .action(() => console.log(process.argv));

program.parse(process.argv);
