#!/usr/bin/env node

import Commander, { program } from 'commander';
import packageJson from '../package.json';

// const program = new Commander.Command(packageJson.name)
//   .version(packageJson.version)
//   .allowUnknownOption()
//   .parse(process.argv);

// console.log(program);

// action
program.action(cmd => console.log('✓ Running!!'));

program.parse(process.argv);
