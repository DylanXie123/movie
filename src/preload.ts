import { contextBridge, ipcRenderer } from 'electron';
import fs from 'original-fs';
import { join } from 'path';
import FileNode, { DBNode } from './fileNode';

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

const readFileTree = (root: FileNode): FileNode => {
  const dirs = readDir(root.fullPath);
  const subTree = dirs.map(dir => {
    const subPath = join(root.fullPath, dir.name);
    const stat = statSync(subPath);
    const fileNode = new FileNode({
      fullPath: subPath,
      blocks: stat.blocks,
      blksize: stat.blksize,
      size: stat.size,
      isDirectory: dir.isDirectory,
      isFile: dir.isFile,
    });
    return dir.isDirectory ? readFileTree(fileNode) : fileNode;
  });
  root.children = subTree;
  return root;
}

const initFileTree = (path: string) => {
  const stat = fs.statSync(path);
  if (stat.isDirectory()) {
    const fileNode = new FileNode({
      fullPath: path,
      blocks: stat.blocks,
      blksize: stat.blksize,
      size: stat.size,
      isDirectory: true,
      isFile: false,
    });
    return readFileTree(fileNode);
  } else {
    throw new Error(`${path} is not a directory`);
  }
}

const flatFileTree = (fileTree: FileNode): FileNode[] => {
  const fileList = [];
  if (fileTree.children) {
    for (const item of fileTree.children) {
      fileList.push(...flatFileTree(item));
    }
    return fileList;
  } else {
    return [fileTree];
  }
}

const fsAPI = {
  readDir: readDir,
  statSync: statSync,
  initFileTree: initFileTree,
  flatFileTree: flatFileTree,
};

const api_key = {
  TMDB: process.env.TMDB_API_KEY!,
  IMDB: process.env.IMDB_API_KEY!,
};

const dbAPI = {
  create: (item: DBNode) => ipcRenderer.send('create', item),
  retrieve: async (fullPath: string) => { },
  update: async (pathKey: string) => { },
  delete: async (pathKey: string) => { },
  retrieveAll: () => ipcRenderer.send('retrieveAll'),
};

// dbAPI.create({
//   fullPath: 'sth',
//   title: 'new movie',
//   TMDB_ID: 0,
//   IMDB_ID: 0,
//   poster_URL: '',
//   background_URL: '',
//   overview: '',
//   language: '',
//   release_Date: 0,
//   TMDB_Rating: 0,
//   IMDB_Rating: 0,
// });

dbAPI.retrieveAll();

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