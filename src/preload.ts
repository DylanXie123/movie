import { contextBridge } from 'electron';
import fs from 'original-fs';
import { join } from 'path';
import FileNode from './FileNode';

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

const readFileNode = (path: string): FileNode[] => {
  const dirs = readDir(path);
  return dirs.map(dir => {
    if (dir.isDirectory) {
      let stat = statSync(join(path, dir.name));
      return new FileNode({
        name: dir.name,
        blocks: stat.blocks,
        blksize: stat.blksize,
        size: stat.size,
        isDirectory: dir.isDirectory,
        isFile: dir.isFile,
        children: readFileNode(join(path, dir.name)),
      });
    } else {
      let stat = statSync(join(path, dir.name));
      return new FileNode({
        name: dir.name,
        blocks: stat.blocks,
        blksize: stat.blksize,
        size: stat.size,
        isDirectory: dir.isDirectory,
        isFile: dir.isFile,
      });
    }
  });
}

const api = {
  readDir: readDir,
  statSync: statSync,
  readFileNode: readFileNode,
  raw: fs,
};

contextBridge.exposeInMainWorld('fsAPI', api);

declare global {
  interface Window {
    fsAPI: typeof api;
  }
}

export { }