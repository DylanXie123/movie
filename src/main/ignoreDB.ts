import Database from 'better-sqlite3';
import { app } from 'electron';

export interface IgnoreData {
  fullPath: string;
  recursive: boolean;
}

const convertToDB = (item: IgnoreData) => {
  if (item.recursive) {
    return { ...item, recursive: 1 };
  } else {
    return { ...item, recursive: 0 };
  }
}

const connectToDatabase = () => {
  // If in debug mode, files will be saved to the root directory of the repository.
  // Otherwise they will be found in the 'appData/Today List/user' folder.
  if (process.env.NODE_ENV === 'development') {
    const db = new Database('Ignore.db');
    return db;
  } else {
    const db = new Database(app.getPath('userData') + '/user/Ignore.db');
    return db;
  }
}

const db = connectToDatabase();

const initDatabase = () => {
  return db.prepare(`
    CREATE TABLE IF NOT EXISTS Ignore (
      fullPath	TEXT NOT NULL UNIQUE,
      recursive	INTEGER NOT NULL,
      PRIMARY KEY("fullPath")
    )
  `).run();
}

const create = (item: IgnoreData) => {
  const insert = db.prepare(`
    INSERT INTO Ignore VALUES 
    (@fullPath, @recursive)
  `);
  return insert.run(convertToDB(item));
}

const update = (newData: IgnoreData) => {
  const updateItem = db.prepare(`UPDATE Ignore SET recursive = @recursive WHERE fullPath = @fullPath`);
  return updateItem.run(newData);
}

const retrieve = (fullPath: string) => {
  const selectItem = db.prepare(`SELECT * FROM Ignore WHERE fullPath = @fullPath`);
  return selectItem.all({ fullPath: fullPath });
}

const retrieveAll = () => {
  const retrieve = db.prepare(`SELECT * FROM Ignore`);
  const result = retrieve.all();
  return result;
}

const deleteDB = (fullPath: string) => {
  const del = db.prepare(`DELETE FROM Ignore WHERE fullPath = @fullPath`);
  return del.run({ fullPath: fullPath });
}

const closeDB = () => {
  return db.close();
}

const IgnoreDB = {
  initDatabase: initDatabase,
  create: create,
  update: update,
  retrieve: retrieve,
  retrieveAll: retrieveAll,
  deleteDB: deleteDB,
  closeDB: closeDB,
}

export default IgnoreDB;