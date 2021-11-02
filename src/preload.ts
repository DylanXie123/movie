import type Database from 'better-sqlite3';
import { contextBridge, ipcRenderer } from 'electron';
import fs from 'original-fs';
import type { DBNode, UpdateType } from './fileNode';

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

const fsAPI = {
  readDir: readDir,
  statSync: statSync,
  existSync: existSync,
  addLitsener: addLitsener,
};

const api_key = {
  TMDB: process.env.TMDB_API_KEY!,
  IMDB: process.env.IMDB_API_KEY!,
};

const dbAPI = {
  create: (item: DBNode) => ipcRenderer.invoke('create', item) as Promise<Database.RunResult>,
  retrieve: (fullPath: string) => ipcRenderer.invoke('retrieve', fullPath) as Promise<DBNode>,
  update: (newData: UpdateType) => ipcRenderer.invoke('update', newData) as Promise<Database.RunResult>,
  delete: (fulllPath: string) => ipcRenderer.invoke('delete', fulllPath) as Promise<Database.RunResult>,
  retrieveAll: () => ipcRenderer.invoke('retrieveAll') as Promise<DBNode[]>,
};

contextBridge.exposeInMainWorld('fsAPI', fsAPI);
contextBridge.exposeInMainWorld('api_key', api_key);
contextBridge.exposeInMainWorld('dbAPI', dbAPI);

declare global {
  interface Window {
    fsAPI: typeof fsAPI;
    api_key: typeof api_key;
    dbAPI: typeof dbAPI;
  }
}

export { }