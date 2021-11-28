import FileNode from "./fileNode";
import { join } from 'path';
import TMDBAPI from "../../api/TMDB";

export const readSingleFileNode = (path: string) => {
  const stat = window.fsAPI.statSync(path);
  const newNode = new FileNode({
    fullPath: path,
    blocks: stat.blocks,
    blksize: stat.blksize,
    size: stat.size,
  });
  return newNode;
}

export const readFileNodes = (path: string): FileNode[] => {
  const dirs = window.fsAPI.readDir(path);
  let nodes: FileNode[] = [];
  dirs.forEach(dir => {
    if (dir.isDirectory) {
      const subPath = join(path, dir.name);
      const newNodes = readFileNodes(subPath);
      nodes.push(...newNodes);
    } else {
      const fullPath = join(path, dir.name);
      const newNode = readSingleFileNode(fullPath);
      nodes.push(newNode);
    }
  });
  return nodes;
}

const initFileNodes = (path: string) => {
  const exist = window.fsAPI.existSync(path);
  if (exist) {
    return readFileNodes(path);
  } else {
    throw new Error(`${path} is not a directory`);
  }
}

export const validateNode = (fileNode: FileNode) => {
  const format = new RegExp("^\.(mp4|mkv|avi|rmvb|webm|flv)$");
  return format.test(fileNode.parsed.ext);
}

export const appendMovieAPI = async (fileNodes: FileNode[]) =>
  Promise.all(fileNodes.map(async node => {
    if (!node.movie) {
      const movieInfo = await TMDBAPI.searchMovie(node.parsed.name);
      if (movieInfo && movieInfo.length) {
        node.movie = movieInfo[0];
        window.movieDBAPI.create(movieInfo[0], node.parsed.name);
      }
    }
    return node;
  }));

export const appendMovieDB = async (fileNodes: FileNode[]) => {
  const infos = await window.movieDBAPI.retrieve(fileNodes.map(node => node.parsed.name));
  fileNodes.forEach((node, index) => node.movie = infos[index]);
  return fileNodes;
}

export const initIgnoreDB = async () => await window.ignoreDBAPI.retrieveAll();

export default initFileNodes;