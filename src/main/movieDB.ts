import Database from 'better-sqlite3';
import type { MovieProp } from '../fileNode';

export type MovieDBData = Omit<MovieProp, "releaseDate"> & { fileName: string, releaseDate?: string };

export type MocieDBUpdate = Partial<MovieDBData> & { fileName: string };

const connectToDatabase = () => new Database('Movie.db');

const db = connectToDatabase();

const initDatabase = () => {
  return db.prepare(`
    CREATE TABLE IF NOT EXISTS Movie (
      fileName	TEXT NOT NULL UNIQUE,
      title	TEXT NOT NULL,
      tmdbID	INTEGER NOT NULL,
      imdbID	INTEGER NOT NULL,
      posterURL	TEXT NOT NULL,
      backgroundURL	TEXT NOT NULL,
      overview	TEXT,
      language	TEXT,
      releaseDate	TEXT,
      tmdbRating	NUMERIC,
      imdbRating	NUMERIC,
      PRIMARY KEY("fileName")
    )
  `).run();
}

const importDB = (path: string) => {
  const inputDB = new Database(path, { fileMustExist: true });
  const retrieve = inputDB.prepare(`SELECT * FROM Movie`);
  const inputData = retrieve.all();
  const insert = db.prepare(`
    INSERT OR REPLACE INTO Movie VALUES 
    (@fileName, @title, @tmdbID, @imdbID, @posterURL, @backgroundURL, 
    @overview, @language, @releaseDate, @tmdbRating, @imdbRating)
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
      @overview, @language, @releaseDate, @tmdbRating, @imdbRating)
  `);
  return insert.run(item);
}

const update = (newData: MocieDBUpdate) => {
  let query = '';
  for (const key in newData) {
    query = query + `, ${key} = @${key}`;
  }
  query = query.slice(2);
  const updateItem = db.prepare(`UPDATE Movie SET ${query} WHERE fileName = @fileName`);
  return updateItem.run(newData);
}

const retrieve = (fileName: string) => {
  const selectItem = db.prepare(`SELECT * FROM Movie WHERE fileName = @fileName`);
  return selectItem.all({ fileName });
}

const retrieveAll = () => {
  const retrieve = db.prepare(`SELECT * FROM Movie`);
  const result = retrieve.all();
  return result;
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