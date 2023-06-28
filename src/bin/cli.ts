import { program } from 'commander';

// action
program.action(cmd => console.log('✓ Running!!'));

program.parse(process.argv);
