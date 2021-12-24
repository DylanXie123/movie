import IgnoreDB from '../main/ignoreDB';
import type { MovieDBData } from '../main/movieDB';
import MovieDB from '../main/movieDB';
import { CastInfo, MovieInfo } from '../renderer/store/fileNode';

const convertToDB = (movie: Partial<MovieInfo>, fileName: string): Partial<MovieDBData> => ({
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

const convertFromDB = (movie: MovieDBData): MovieInfo =>
  new MovieInfo({
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
  importDB: (fullPath: string) => MovieDB.importDB(fullPath).map(convertFromDB),
  create: (movie: MovieInfo, fileName: string) => {
    const dbItem = convertToDB(movie, fileName);
    return MovieDB.create(dbItem as MovieDBData);
  },
  retrieve: (fileNames: string[]) =>
    MovieDB.retrieve(fileNames).map((item) => item ? convertFromDB(item) : undefined),
  update: (newData: Partial<MovieInfo>, fileName: string) => {
    const dbItem = convertToDB(newData, fileName);
    return MovieDB.update(dbItem as MovieDBData);
  },
  delete: (fileName: string) => MovieDB.deleteDB(fileName),
  retrieveAll: () => MovieDB.retrieveAll().map(item => [item.fileName, convertFromDB(item)]),
};

const ignoreDBAPI = {
  importDB: IgnoreDB.importDB,
  create: IgnoreDB.create,
  retrieve: IgnoreDB.retrieve,
  update: IgnoreDB.update,
  delete: IgnoreDB.deleteDB,
  retrieveAll: IgnoreDB.retrieveAll,
};


export { movieDBAPI, ignoreDBAPI };