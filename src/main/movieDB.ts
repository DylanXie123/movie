import Database from 'better-sqlite3';
import type { MovieInfo } from '../renderer/store/fileNode';

export type MovieDBData = Omit<MovieInfo, "releaseDate" | "genres" | "credits"> & {
  fileName: string,
  releaseDate: string,
  genres: string,
  credits: string,
};

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
      runtime NUMERIC,
      genres	TEXT NOT NULL,
      credits	TEXT NOT NULL,
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
      @overview, @language, @releaseDate, @tmdbRating, @imdbRating, 
      @runtime, @genres, @credits)
  `);
  const insertMany = db.transaction((values: any[]) =>
    values.map(item => insert.run(item))
  );
  insertMany(inputData);
  return inputData;
}

const create = (item: MovieDBData) => {
  const insert = db.prepare(`
    INSERT INTO Movie VALUES 
    (@fileName, @title, @tmdbID, @imdbID, @posterURL, @backgroundURL, 
      @overview, @language, @releaseDate, @tmdbRating, @imdbRating,
      @runtime, @genres, @credits)
  `);
  return insert.run(item);
}

const update = (item: Partial<MovieDBData> & { fileName: string }) => {
  let query = '';
  for (const key in item) {
    query = query + `, ${key} = @${key}`;
  }
  query = query.slice(2);
  const updateItem = db.prepare(`UPDATE Movie SET ${query} WHERE fileName = @fileName`);
  return updateItem.run(item);
}

const retrieve = (fileNames: string[]) => {
  const rtv = db.prepare(`SELECT * FROM Movie WHERE fileName = @fileName`);
  const retrieveMany = db.transaction(
    (names: string[]) => names.map(n => rtv.get({ fileName: n }))
  );
  return retrieveMany(fileNames) as (MovieDBData | undefined)[];
}

const retrieveAll = () => {
  const retrieve = db.prepare(`SELECT * FROM Movie`);
  return retrieve.all() as MovieDBData[];
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