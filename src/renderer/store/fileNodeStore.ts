import { writable } from "svelte/store";
import TMDBAPI from "../../api/TMDB";
import type FileNode from "../../fileNode";
import type { DBNode } from "../../fileNode";
import type { MovieProp } from "../../fileNode";

/**
 * read data from database
 * 
 * @returns FileNode data read from database
 */
const init = () => {
  const fileTree = window.fsAPI.initFileTree("D:\\OneDrive - stu.xjtu.edu.cn\\Media\\Movies\\Marvel");
  const fileList = window.fsAPI.flatFileTree(fileTree);


  return fileList;
}

/**
 * persist data
 * @param data FileNode data to be saved
 * @returns save result, true or false
 */
const save = async (data: FileNode) => {
  return true;
}

/**
 * compare oldTree and newTree, only update needed part
 * @param oldTree 
 * @param newTree 
 * @returns diff result
 */
const diffTree = (oldTree: FileNode, newTree: FileNode) => {
  return newTree;
}

function createFileNodeStore() {
  const fileNodes = init();
  const { subscribe, set, update } = writable(fileNodes);


  const readDB = (movie: DBNode): MovieProp => ({
    title: movie.title,
    tmdbID: movie.tmdbID,
    imdbID: movie.imdbID,
    posterURL: movie.posterURL,
    backgroundURL: movie.posterURL,
    overview: movie.overview,
    releaseDate: movie.releaseDate ? new Date(movie.releaseDate) : undefined,
    tmdbRating: movie.tmdbRating,
    imdbRating: movie.imdbRating,
  });

  const saveDB = (movie: MovieProp, fulllPath: string): DBNode => ({
    fullPath: fulllPath,
    title: movie.title,
    tmdbID: movie.tmdbID,
    imdbID: movie.imdbID,
    posterURL: movie.posterURL,
    backgroundURL: movie.backgroundURL,
    overview: movie.overview,
    releaseDate: movie.releaseDate ? movie.releaseDate.getMilliseconds() : undefined,
    tmdbRating: movie.tmdbRating,
    imdbRating: movie.imdbRating,
  });

  /**
   * read data from database first
   * if file not exist, request data from TMDB API
   */
  window.dbAPI.retrieveAll().then(items => {
    fileNodes.forEach(file => {
      const movie = items.find(item => item.fullPath === file.fullPath);
      if (movie) {
        file.movie = readDB(movie);
      } else {
        TMDBAPI.useIMDBSearch(file.parsed.name).then(movie => {
          file.movie = movie;
          if (movie) {
            const dbNode = saveDB(movie, file.fullPath);
            window.dbAPI.create(dbNode);
          }
        });
      }
    })
  });

  return {
    subscribe,
  };
}

const fileNodeStore = createFileNodeStore();
export default fileNodeStore;
