import fs from 'fs';
import path from 'path';

export const makeConfigFile = (root: string) => {
  return fs.promises.appendFile(root, '');
};
