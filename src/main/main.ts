import { app, BrowserWindow, ipcMain, shell } from 'electron';
import Store from 'electron-store';
import type { IgnoreData } from '../renderer/store/ignore';
import IgnoreDB from './ignoreDB';
import MovieDB, { MovieDBData } from './movieDB';

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  MovieDB.initDatabase();
  IgnoreDB.initDatabase();
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    }
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  if (process.env.NODE_ENV === 'development') {
    // Open the DevTools.
    mainWindow.webContents.openDevTools();
  }

  Store.initRenderer();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    MovieDB.closeDB();
    IgnoreDB.closeDB();
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.handle('openFile', async (_event, fullPath: string) => {
  return await shell.openPath(fullPath);
})

// MovieDB related events
ipcMain.handle('movieDBimportDB', (_event, fullPath: string) => {
  return MovieDB.importDB(fullPath);
})

ipcMain.handle('movieDBCreate', (_event, item: MovieDBData) => {
  return MovieDB.create(item);
})

ipcMain.handle('movieDBUpdate', (_event, newItem: Partial<MovieDBData> & { fileName: string }) => {
  return MovieDB.update(newItem);
})

ipcMain.handle('movieDBRetrieve', (_event, fileNames: string[]) => {
  return MovieDB.retrieve(fileNames);
})

ipcMain.handle('movieDBDelete', (_event, fileName: string) => {
  return MovieDB.deleteDB(fileName);
})

ipcMain.handle('movieDBRetrieveAll', (_event) => {
  return MovieDB.retrieveAll();
})

// IgnoreDB related events
ipcMain.handle('ignoreDBimportDB', (_event, fullPath: string) => {
  return IgnoreDB.importDB(fullPath);
})

ipcMain.handle('ignoreDBCreate', (_event, item: IgnoreData) => {
  return IgnoreDB.create(item);
})

ipcMain.handle('ignoreDBUpdate', (_event, newData: IgnoreData) => {
  return IgnoreDB.update(newData);
})

ipcMain.handle('ignoreDBRetrieve', (_event, fullPath: string) => {
  return IgnoreDB.retrieve(fullPath);
})

ipcMain.handle('ignoreDBDelete', (_event, fullPath: string) => {
  return IgnoreDB.deleteDB(fullPath);
})

ipcMain.handle('ignoreDBRetrieveAll', (_event) => {
  return IgnoreDB.retrieveAll();
})
