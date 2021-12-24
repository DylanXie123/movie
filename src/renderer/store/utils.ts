import FileNode, { FileTree, MovieInfo } from "./fileNode";
import { join, parse } from 'path';
import TMDBAPI from "../../api/TMDB";
import type { IgnoreData } from "./ignore";

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

/**
 * use try catch to handle file permission
 * https://nodejs.org/api/fs.html#fsaccesspath-mode-callback
 */
export const readFileTree = (path: string): FileTree | undefined => {
  try {
    const rootNode = readSingleFileNode(path);
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

export const validateNode = (fileNode: FileNode) => {
  const format = new RegExp("^\.(mp4|mkv|avi|rmvb|webm|flv)$");
  return format.test(fileNode.parsed.ext);
}

export const appendMovieAPI = async (fileTree: FileTree) => {
  await Promise.all(fileTree.map(async node => {
    if (!node.movie) {
      const movieInfo = await TMDBAPI.searchMovie(node.parsed.name);
      if (movieInfo && movieInfo.length) {
        node.movie = movieInfo[0];
        window.movieDBAPI.create(movieInfo[0], node.parsed.name);
      }
    }
  }));
  return fileTree;
}

export const appendMovieDB = async (fileTree: FileTree) => {
  const movieDB = new Map(window.movieDBAPI.retrieveAll() as Iterable<[string, MovieInfo]>);
  fileTree.forEachWithStop(node => {
    /**
     * in folder node, `Harry.Potter.and.the.Goblet.of.Fire.2005.1080p.BluRay.x265-RARBG` folder
     * will be parsed as `(Harry.Potter.and.the.Goblet.of.Fire.2005.1080p.BluRay).x265-RARBG` file
     * so, use `parsed.base` to search db
     */
    const movie = movieDB.get(node.children ? node.parsed.base : node.parsed.name);
    if (movie) node.movie = movie;
    return movie === undefined;
  })
  return fileTree;
}

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
