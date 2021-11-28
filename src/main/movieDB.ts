import Database from 'better-sqlite3';
import type { MovieInfo } from '../renderer/store/fileNode';

type MovieDBData = Omit<MovieInfo, "releaseDate"> & { fileName: string, releaseDate: string };

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
});

const convertFromDB = (movie: MovieDBData): MovieInfo => ({
  title: movie.title,
  tmdbID: movie.tmdbID,
  imdbID: movie.imdbID,
  posterURL: movie.posterURL,
  backgroundURL: movie.posterURL,
  overview: movie.overview,
  language: movie.language,
  releaseDate: new Date(movie.releaseDate),
  tmdbRating: movie.tmdbRating,
  imdbRating: movie.imdbRating,
});

const connectToDatabase = () => new Database('Movie.sqlite');

const db = connectToDatabase();

const initDatabase = () => {
  return db.prepare(`
    CREATE TABLE IF NOT EXISTS Movie (
      fileName	TEXT NOT NULL UNIQUE,
      title	TEXT NOT NULL,
      tmdbID	INTEGER NOT NULL,
      imdbID	INTEGER,
      posterURL	TEXT,
      backgroundURL	TEXT,
      overview	TEXT,
      language	TEXT NOT NULL,
      releaseDate	TEXT NOT NULL,
      tmdbRating	NUMERIC NOT NULL,
      imdbRating	NUMERIC,
      PRIMARY KEY("fileName")
    )
  `).run();
}

const importDB = (path: string) => {
  const inputDB = new Database(path, { fileMustExist: true });
  const retrieve = inputDB.prepare(`SELECT * FROM Movie`);
  const inputData = retrieve.all() as MovieDBData[];
  const insert = db.prepare(`
    INSERT OR REPLACE INTO Movie VALUES 
    (@fileName, @title, @tmdbID, @imdbID, @posterURL, @backgroundURL, 
    @overview, @language, @releaseDate, @tmdbRating, @imdbRating)
  `);
  const insertMany = db.transaction((values: any[]) =>
    values.map(item => insert.run(item))
  );
  insertMany(inputData);
  return inputData.map(convertFromDB);
}

const create = (movie: MovieInfo, fileName: string) => {
  const item = convertToDB(movie, fileName);
  const insert = db.prepare(`
    INSERT INTO Movie VALUES 
    (@fileName, @title, @tmdbID, @imdbID, @posterURL, @backgroundURL, 
      @overview, @language, @releaseDate, @tmdbRating, @imdbRating)
  `);
  return insert.run(item);
}

const update = (newData: Partial<MovieInfo>, fileName: string) => {
  const item = convertToDB(newData, fileName);
  let query = '';
  for (const key in item) {
    query = query + `, ${key} = @${key}`;
  }
  query = query.slice(2);
  const updateItem = db.prepare(`UPDATE Movie SET ${query} WHERE fileName = @fileName`);
  return updateItem.run({ ...item, fileName });
}

const retrieve = (fileNames: string[]) => {
  const rtv = db.prepare(`SELECT * FROM Movie WHERE fileName = @fileName`);
  const retrieveMany = db.transaction(
    (names: string[]) => names.map(n => rtv.get({ fileName: n }))
  );
  const results = retrieveMany(fileNames);
  return results.map(r => r ? convertFromDB(r) : undefined);
}

const retrieveAll = () => {
  const retrieve = db.prepare(`SELECT * FROM Movie`);
  const results = retrieve.all() as MovieDBData[];
  return results.map(convertFromDB);
}

const deleteDB = (fileName: string) => {
  const del = db.prepare(`DELETE FROM Movie WHERE fileName = @fileName`);
  return del.run({ fileName });
}

const closeDB = () => {
  return db.close();
}

const MovieDB = {
  initDatabase,
  importDB,
  create,
  update,
  retrieve,
  retrieveAll,
  deleteDB,
  closeDB,
}

export default MovieDB;