import type Database from 'better-sqlite3';
import { contextBridge, ipcRenderer } from 'electron';
import fs from 'original-fs';
import type { IgnoreData } from './main/ignoreDB';
import type { MovieDBData, MocieDBUpdate } from './main/movieDB';

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
  return ipcRenderer.invoke('openFile', fullPath) as Promise<string>;
};

const fsAPI = {
  readDir: readDir,
  statSync: statSync,
  existSync: existSync,
  addLitsener: addLitsener,
  openFile: openFile,
};

const api_key = {
  TMDB: process.env.TMDB_API_KEY!,
  IMDB: process.env.IMDB_API_KEY!,
};

const movieDBAPI = {
  importDB: (fullPath: string) => ipcRenderer.invoke('movieDBimportDB', fullPath) as Promise<MovieDBData[]>,
  create: (item: MovieDBData) => ipcRenderer.invoke('movieDBCreate', item) as Promise<Database.RunResult>,
  retrieve: (fileName: string) => ipcRenderer.invoke('movieDBRetrieve', fileName) as Promise<MovieDBData>,
  update: (newData: MocieDBUpdate) => ipcRenderer.invoke('movieDBUpdate', newData) as Promise<Database.RunResult>,
  delete: (fileName: string) => ipcRenderer.invoke('movieDBDelete', fileName) as Promise<Database.RunResult>,
  retrieveAll: () => ipcRenderer.invoke('movieDBRetrieveAll') as Promise<MovieDBData[]>,
};

const ignoreDBAPI = {
  importDB: (fullPath: string) => ipcRenderer.invoke('ignoreDBimportDB', fullPath) as Promise<IgnoreData[]>,
  create: (item: IgnoreData) => ipcRenderer.invoke('ignoreDBCreate', item) as Promise<Database.RunResult>,
  retrieve: (fullPath: string) => ipcRenderer.invoke('ignoreDBRetrieve', fullPath) as Promise<MovieDBData>,
  update: (newData: IgnoreData) => ipcRenderer.invoke('ignoreDBUpdate', newData) as Promise<Database.RunResult>,
  delete: (fulllPath: string) => ipcRenderer.invoke('ignoreDBDelete', fulllPath) as Promise<Database.RunResult>,
  retrieveAll: () => ipcRenderer.invoke('ignoreDBRetrieveAll') as Promise<IgnoreData[]>,
};

contextBridge.exposeInMainWorld('fsAPI', fsAPI);
contextBridge.exposeInMainWorld('api_key', api_key);
contextBridge.exposeInMainWorld('movieDBAPI', movieDBAPI);
contextBridge.exposeInMainWorld('ignoreDBAPI', ignoreDBAPI);

declare global {
  interface Window {
    fsAPI: typeof fsAPI;
    api_key: typeof api_key;
    movieDBAPI: typeof movieDBAPI;
    ignoreDBAPI: typeof ignoreDBAPI;
  }
}

export { }