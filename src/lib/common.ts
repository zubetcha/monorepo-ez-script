import path from 'path';
import fs from 'fs';

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

export { hasPath, terminate, log };
