import path from 'path';
import fs from 'fs';
import chalk from 'chalk';

const HEX_COLOR = {
  green: '#0AC290',
  blue: '#448AFF',
  cyan: '#18FFFF',
};

const customChalk = {
  green: (text: string) => chalk.hex(HEX_COLOR.green)(text),
  blue: (text: string) => chalk.hex(HEX_COLOR.blue)(text),
  cyan: (text: string) => chalk.hex(HEX_COLOR.cyan)(text),
  yellow: (text: string) => chalk.yellow(text),
};

const hasPath = (cwd: string = '.', p: string) => {
  return fs.existsSync(path.resolve(cwd, p));
};

const log = (message: string, type?: 'log' | 'error' | 'warn') => {
  console[type || 'log'](message);
};

const terminate = (message?: string) => {
  if (message) {
    log('');
    log(message, 'error');
  }

  process.exit(1);
};

export { hasPath, terminate, log, customChalk };
