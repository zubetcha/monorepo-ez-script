import path from 'path';
import fs from 'fs';
import chalk from 'chalk';

const HEX = {
  green: '#0AC290',
  blue: '#448AFF',
  cyan: '#18FFFF',
  yellow: '#FFF48D',
};

const customChalk = {
  green: (text: string) => chalk.hex(HEX.green)(text),
  blue: (text: string) => chalk.hex(HEX.blue)(text),
  cyan: (text: string) => chalk.hex(HEX.cyan)(text),
  yellow: (text: string) => chalk.hex(HEX.yellow)(text),
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
