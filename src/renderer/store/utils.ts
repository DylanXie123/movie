import FileNode, { MovieProp } from "../../fileNode";
import { join } from 'path';
import TMDBAPI from "../../api/TMDB";
import type { MovieDBData } from "../../main/movieDB";

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

export const convertToDB = (movie: MovieProp, fileName: string): MovieDBData => ({
  fileName: fileName,
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

export const appendMovieAPI = async (fileNodes: FileNode[]) =>
  Promise.all(fileNodes.map(async node => {
    if (!node.movie) {
      const movieInfo = await TMDBAPI.searchMovie(node.parsed.name);
      if (movieInfo && movieInfo.length && movieInfo.length > 0) {
        node.movie = movieInfo[0];
        const dbNode = convertToDB(movieInfo[0], node.parsed.name);
        window.movieDBAPI.create(dbNode);
      }
    }
    return node;
  }));

export const appendMovieDB = async (fileNodes: FileNode[]) => {
  const convertFromDB = (movie: MovieDBData): MovieProp => ({
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

  const moviesDB = await window.movieDBAPI.retrieveAll();

  const movieNodes = fileNodes.map(node => {
    const movie = moviesDB.find(item => item.fileName === node.parsed.name);
    if (movie) node.movie = convertFromDB(movie);
    return node;
  })

  return movieNodes;
}

export const initIgnoreDB = async () => await window.ignoreDBAPI.retrieveAll();

export default initFileNodes;