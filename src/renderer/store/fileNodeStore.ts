import { Updater, writable } from "svelte/store";
import TMDBAPI from "../../api/TMDB";
import type FileNode from "../../fileNode";
import type { DBNode } from "../../fileNode";
import type { MovieProp } from "../../fileNode";
import { join } from 'path';

const path = "D:\\OneDrive - stu.xjtu.edu.cn\\Media\\Movies\\Marvel";

const init = () => {
  const fileNodes = window.fsAPI.initFileNodes(path);
  return fileNodes.filter(node => validateNode(node));
}

const validateNode = (fileNode: FileNode) => {
  const format = new RegExp("^\.(mp4|mkv|avi|rmvb|webm|flv)$");
  return format.test(fileNode.parsed.ext);
}

const appendMovie = async (fileNodes: FileNode[]) => {
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
const addLitsener = (updater: (this: void, updater: Updater<FileNode[]>) => void) =>
  window.fsAPI.addLitsener(path, (fileName) => {
    const changedPath = join(path, fileName);
    const exist = window.fsAPI.existSync(changedPath);
    if (exist) {
      const newNode = window.fsAPI.readSingleFileNode(changedPath);
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


function createFileNodeStore() {
  const fileNodes = init();
  const { subscribe, set, update } = writable(fileNodes);

  appendMovie(fileNodes).then(newNodes => set(newNodes));
  addLitsener(update);

  return {
    subscribe,
  };
}

const fileNodeStore = createFileNodeStore();
export default fileNodeStore;
