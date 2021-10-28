import Database from 'better-sqlite3';
import { app } from 'electron';
import type { DBNode } from '../fileNode';

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
      TMDB_ID	INTEGER NOT NULL,
      IMDB_ID	INTEGER NOT NULL,
      poster_URL	TEXT NOT NULL,
      background_URL	TEXT NOT NULL,
      overview	TEXT,
      language	TEXT,
      release_Date	INTEGER,
      TMDB_Rating	NUMERIC,
      IMDB_Rating	NUMERIC,
      PRIMARY KEY("fullPath")
    )
  `).run();
}

export const create = (item: DBNode) => {
  const insert = db.prepare(`
    INSERT INTO Movie VALUES 
    (@fullPath, @title, @TMDB_ID, @IMDB_ID, @poster_URL, @background_URL, 
      @overview, @language, @release_Date, @TMDB_Rating, @IMDB_Rating)
  `);
  insert.run(item);
}

export const update = (item: DBNode) => { }

export const retrieve = (fullPath: string) => { }

export const retrieveAll = () => {
  const retrieve = db.prepare(`SELECT * FROM Movie`);
  const result = retrieve.all();
  console.log(result);
  return result;
}

export const deleteDB = (fullPath: string) => {
  const del = db.prepare(`DELETE FROM Movie WHERE fullPath = @fullPath`);
  del.run({ fullPath });
}

export const closeDB = () => {
  db.close();
}