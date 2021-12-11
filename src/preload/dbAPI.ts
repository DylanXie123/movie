import type Database from 'better-sqlite3';
import { ipcRenderer } from 'electron';
import type { MovieDBData } from '../main/movieDB';
import { CastInfo, MovieInfo } from '../renderer/store/fileNode';
import type { IgnoreData } from '../renderer/store/ignore';

const convertToDB = (movie: any, fileName: string): Partial<MovieDBData> => ({
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
  runtime: movie.runtime,
  genres: JSON.stringify(movie.genres),
  credits: JSON.stringify(movie.credits),
});

const convertFromDB = (movie: MovieDBData) => ({
  title: movie.title,
  tmdbID: movie.tmdbID,
  imdbID: movie.imdbID,
  posterURL: movie.posterURL,
  backgroundURL: movie.backgroundURL,
  overview: movie.overview,
  language: movie.language,
  releaseDate: new Date(movie.releaseDate),
  tmdbRating: movie.tmdbRating,
  imdbRating: movie.imdbRating,
  runtime: movie.runtime,
  genres: JSON.parse(movie.genres),
  credits: (JSON.parse(movie.credits) as []).map(c => new CastInfo(c)),
});

const movieDBAPI = {
  importDB: async (fullPath: string) => {
    const dbItems = await ipcRenderer.invoke('movieDBimportDB', fullPath) as MovieDBData[];
    return dbItems.map(convertFromDB);
  },
  create: (movie: MovieInfo, fileName: string) => {
    const dbItem = convertToDB(movie, fileName);
    return ipcRenderer.invoke('movieDBCreate', dbItem) as Promise<Database.RunResult>
  },
  retrieve: async (fileNames: string[]) => {
    const dbItems = await ipcRenderer.invoke('movieDBRetrieve', fileNames) as (MovieDBData | undefined)[];
    return dbItems.map((item) => item ? convertFromDB(item) : undefined);
  },
  update: (newData: Partial<MovieInfo>, fileName: string) => {
    const dbItem = convertToDB(newData, fileName);
    return ipcRenderer.invoke('movieDBUpdate', dbItem) as Promise<Database.RunResult>;
  },
  delete: (fileName: string) => ipcRenderer.invoke('movieDBDelete', fileName) as Promise<Database.RunResult>,
  retrieveAll: async () => {
    const dbItems = await ipcRenderer.invoke('movieDBRetrieveAll') as MovieDBData[];
    return dbItems.map(convertFromDB);
  },
};

const ignoreDBAPI = {
  importDB: (fullPath: string) => ipcRenderer.invoke('ignoreDBimportDB', fullPath) as Promise<IgnoreData[]>,
  create: (item: IgnoreData) => ipcRenderer.invoke('ignoreDBCreate', item) as Promise<Database.RunResult>,
  retrieve: (fullPath: string) => ipcRenderer.invoke('ignoreDBRetrieve', fullPath) as Promise<IgnoreData | undefined>,
  update: (newData: IgnoreData) => ipcRenderer.invoke('ignoreDBUpdate', newData) as Promise<Database.RunResult>,
  delete: (fulllPath: string) => ipcRenderer.invoke('ignoreDBDelete', fulllPath) as Promise<Database.RunResult>,
  retrieveAll: () => ipcRenderer.invoke('ignoreDBRetrieveAll') as Promise<IgnoreData[]>,
};


export { movieDBAPI, ignoreDBAPI };