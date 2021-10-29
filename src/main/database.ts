import Database from 'better-sqlite3';
import { app } from 'electron';
import type { DBNode, UpdateType } from '../fileNode';

const connectToDatabase = () => {
  // If in debug mode, files will be saved to the root directory of the repository.
  // Otherwise they will be found in the 'appData/Today List/user' folder.
  if (process.env.NODE_ENV === 'development') {
    const db = new Database('Movie.db');
    return db;
  } else {
    const db = new Database(app.getPath('userData') + '\\user\\Movie.db');
    return db;
  }
}

const db = connectToDatabase();

export const initDatabase = () => {
  return db.prepare(`
    CREATE TABLE IF NOT EXISTS Movie (
      fullPath	TEXT NOT NULL UNIQUE,
      title	TEXT NOT NULL,
      tmdbID	INTEGER NOT NULL,
      imdbID	INTEGER NOT NULL,
      posterURL	TEXT NOT NULL,
      backgroundURL	TEXT NOT NULL,
      overview	TEXT,
      language	TEXT,
      releaseDate	INTEGER,
      tmdbRating	NUMERIC,
      imdbRating	NUMERIC,
      PRIMARY KEY("fullPath")
    )
  `).run();
}

export const create = (item: DBNode) => {
  const insert = db.prepare(`
    INSERT INTO Movie VALUES 
    (@fullPath, @title, @tmdbID, @imdbID, @posterURL, @backgroundURL, 
      @overview, @language, @releaseDate, @tmdbRating, @imdbRating)
  `);
  return insert.run(item);
}

export const update = (newData: UpdateType) => {
  let query = '';
  for (const key in newData) {
    query = query + `, ${key} = @${key}`;
  }
  query = query.slice(2);
  const updateItem = db.prepare(`UPDATE Movie SET ${query} WHERE fullPath = @fullPath`);
  return updateItem.run(newData);
}

export const retrieve = (fullPath: string) => {
  const selectItem = db.prepare(`SELECT * FROM Movie WHERE fullPath = @fullPath`);
  return selectItem.all({ fullPath });
}

export const retrieveAll = () => {
  const retrieve = db.prepare(`SELECT * FROM Movie`);
  const result = retrieve.all();
  return result;
}

export const deleteDB = (fullPath: string) => {
  const del = db.prepare(`DELETE FROM Movie WHERE fullPath = @fullPath`);
  return del.run({ fullPath });
}

export const closeDB = () => {
  return db.close();
}