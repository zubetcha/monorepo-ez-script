import path from 'path';
import fs from 'fs';
import chalk from 'chalk';

const HEX_COLOR = {
  green: '#0AC290',
  blue: '#2979FF',
};

const customChalk = {
  green: (text: string) => chalk.hex(HEX_COLOR.green)(text),
  blue: (text: string) => chalk.hex(HEX_COLOR.blue)(text),
};

const hasPath = (cwd: string = '.', p: string) => {
  return fs.existsSync(path.resolve(cwd, p));
};

const log = (message: string, type?: 'log' | 'error' | 'warn') => {
  console[type || 'log'](message);
};

const terminate = (message?: string) => {
  if (message) {
    log(message, 'error');
  }

  process.exit(1);
};

export { HEX_COLOR, hasPath, terminate, log, customChalk };
