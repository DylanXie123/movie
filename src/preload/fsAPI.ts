import { shell } from 'electron';
import fs from 'original-fs';

const readDir = (path: string) => {
  const dirents = fs.readdirSync(path, { withFileTypes: true });
  return dirents.map(dirent => ({
    name: dirent.name,
    isDirectory: dirent.isDirectory(),
    isFile: dirent.isFile(),
    isBlockDevice: dirent.isBlockDevice(),
    isCharacterDevice: dirent.isCharacterDevice(),
    isFIFO: dirent.isFIFO(),
    isSocket: dirent.isSocket(),
    isSymbolicLink: dirent.isSymbolicLink(),
  }));
}

const statSync = (path: string) => {
  const stat = fs.statSync(path);
  return {
    size: stat.size,
    blksize: stat.blksize,
    blocks: stat.blocks,
  }
}

const existSync = (path: string) => fs.existsSync(path);

const addLitsener = (path: string, listener: (filename: string) => void) => {
  fs.watch(path, { recursive: true }, (event, filename) => {
    if (event === 'rename') {
      listener(filename);
    }
  });
}

const openFile = (fullPath: string) => {
  return shell.openPath(fullPath);
};

const fsAPI = {
  readDir,
  statSync,
  existSync,
  addLitsener,
  openFile,
};

export default fsAPI;
