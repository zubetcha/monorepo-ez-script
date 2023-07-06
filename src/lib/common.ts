import path from 'path';
import fs from 'fs';

export const hasPath = (cwd: string = '.', p: string) => {
  return fs.existsSync(path.resolve(cwd, p));
};
