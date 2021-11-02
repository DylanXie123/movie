import FileNode, { DBNode, MovieProp } from "../../fileNode";
import { join } from 'path';
import TMDBAPI from "../../api/TMDB";
import type { Updater } from "svelte/types/runtime/store";

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

export const appendMovie = async (fileNodes: FileNode[]) => {
  const convertFromDB = (movie: DBNode): MovieProp => ({
    title: movie.title,
    tmdbID: movie.tmdbID,
    imdbID: movie.imdbID,
    posterURL: movie.posterURL,
    backgroundURL: movie.posterURL,
    overview: movie.overview,
    language: movie.language,
    releaseDate: movie.releaseDate ? new Date(movie.releaseDate) : undefined,
    tmdbRating: movie.tmdbRating,
    imdbRating: movie.imdbRating,
  });

  const convertToDB = (movie: MovieProp, fulllPath: string): DBNode => ({
    fullPath: fulllPath,
    title: movie.title,
    tmdbID: movie.tmdbID,
    imdbID: movie.imdbID,
    posterURL: movie.posterURL,
    backgroundURL: movie.backgroundURL,
    overview: movie.overview,
    language: movie.language,
    releaseDate: movie.releaseDate ? movie.releaseDate.toDateString() : undefined,
    tmdbRating: movie.tmdbRating,
    imdbRating: movie.imdbRating,
  });

  const moviesDB = await window.dbAPI.retrieveAll();

  /**
   * read data from database first
   * if file not exist, request data from TMDB API
   */
  const moviePromise = fileNodes.map(async node => {
    const movie = moviesDB.find(item => item.fullPath === node.fullPath);
    if (movie) {
      node.movie = convertFromDB(movie);
    } else {
      const movieInfo = await TMDBAPI.useIMDBSearch(node.parsed.name);
      node.movie = movieInfo;
      if (movieInfo) {
        const dbNode = convertToDB(movieInfo, node.fullPath);
        window.dbAPI.create(dbNode);
      }
    }
    return node;
  })

  return await Promise.all(moviePromise);
}

/**
 * litsen to `rename` event, which will emit whenever a filename appears or disappears in the directory.
 * 
 * https://nodejs.org/api/fs.html#fswatchfilename-options-listener
 * 
 * when change happende, check if directory exists, if exists, create new fileNode, if not, delete original fileNode
 * @param updater update method to update fileNodes
 */
export const addLitsener = (path: string, updater: (this: void, updater: Updater<FileNode[]>) => void) =>
  window.fsAPI.addLitsener(path, (fileName) => {
    const changedPath = join(path, fileName);
    const exist = window.fsAPI.existSync(changedPath);
    if (exist) {
      const newNode = readSingleFileNode(changedPath);
      if (validateNode(newNode)) {
        console.log(newNode);
        updater(oldNodes => {
          oldNodes.push(newNode);
          return oldNodes;
        });
      }
    } else {
      console.log(changedPath);
      updater(oldNodes => oldNodes.filter(node => node.fullPath !== changedPath));
    }
  });


export default initFileNodes;