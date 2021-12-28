import { join, parse } from 'path';
import TMDBAPI from "../../api/TMDB";
import FileTree from './fileTree';
import type { IgnoreData } from "./ignore";
import { MovieInfo, TVInfo } from './media';

export const readLeafFileTree = (path: string) => {
  const stat = window.fsAPI.statSync(path);
  const newNode = new FileTree({
    fullPath: path,
    blocks: stat.blocks,
    blksize: stat.blksize,
    size: stat.size,
  });
  return newNode;
}

/**
 * use try catch to handle file permission
 * https://nodejs.org/api/fs.html#fsaccesspath-mode-callback
 */
export const readFileTree = (path: string): FileTree | undefined => {
  try {
    const rootNode = readLeafFileTree(path);
    if (window.fsAPI.statSync(path).isDirectory) {
      const dirs = window.fsAPI.readDir(path);
      const children = dirs.map(dir => readFileTree(join(path, dir.name)));
      const valid = children.filter(child => child !== undefined) as FileTree[];
      return new FileTree(rootNode, valid);
    } else {
      return new FileTree(rootNode);
    }
  } catch (error) {
    return undefined;
  }
}

export const validateNode = (fileNode: FileTree) => {
  const format = new RegExp("^\.(mp4|mkv|avi|rmvb|webm|flv)$");
  return format.test(fileNode.parsed.ext);
}

export const appendMovieAPI = async (fileTree: FileTree) => {
  await Promise.all(fileTree.map(async node => {
    if (!node.media) {
      const movieInfo = await TMDBAPI.searchMovie(node.parsed.name);
      if (movieInfo && movieInfo.length) {
        node.media = movieInfo[0];
        window.movieDBAPI.create(movieInfo[0].convertToDB(node.parsed.name));
      }
    }
  }));
  return fileTree;
}

export const appendMovieDB = async (fileTree: FileTree) => {
  const movieDB = new Map(window.movieDBAPI.retrieveAll().map(item => [item.fileName, item]));
  fileTree.forEachWithStop(node => {
    const media = movieDB.get(getNodeDBIndex(node));
    if (media) {
      if (media.runtime) {
        node.media = MovieInfo.convertFromDB(media);
      } else if (media.seasons) {
        node.media = TVInfo.convertFromDB(media);
      }
    }
    return media === undefined;
  })
  return fileTree;
}

/**
 * in folder node, `Harry.Potter.and.the.Goblet.of.Fire.2005.1080p.BluRay.x265-RARBG` folder
 * will be parsed as `(Harry.Potter.and.the.Goblet.of.Fire.2005.1080p.BluRay).x265-RARBG` file
 * so, use `parsed.base` to search db
 */
export const getNodeDBIndex = (node: FileTree) => node.isLeaf ? node.parsed.name : node.parsed.base;

export const filterFileTree = (fileTree: FileTree, ignoreList: IgnoreData[]) => {
  ignoreList.forEach(ignore => {
    /**
     * to ignore a node, we need to get ref to its parent node,
     * then remove the node from its parent's children
     */
    const parsed = parse(ignore.fullPath);
    let parentTree = fileTree.query(parsed.dir);
    if (parentTree) parentTree.children?.delete(ignore.fullPath);
  });
  return fileTree;
}

export const initIgnoreDB = async () => window.ignoreDBAPI.retrieveAll();
