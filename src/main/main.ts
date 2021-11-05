import { app, BrowserWindow, ipcMain } from 'electron';
import Store from 'electron-store';
import type { DBNode, UpdateType } from '../fileNode';
import { closeDB, create, deleteDB, initDatabase, retrieve, retrieveAll, update } from './database';

declare const INDEX_WEBPACK_ENTRY: string;
declare const INDEX_PRELOAD_WEBPACK_ENTRY: string;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  initDatabase();
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: INDEX_PRELOAD_WEBPACK_ENTRY,
    }
  });

  // and load the index.html of the app.
  mainWindow.loadURL(INDEX_WEBPACK_ENTRY);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

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
    closeDB();
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

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
ipcMain.handle('create', (_event, item: DBNode) => {
  return create(item);
})

ipcMain.handle('update', (_event, newData: UpdateType) => {
  return update(newData);
})

ipcMain.handle('retrieve', (_event, fileName: string) => {
  return retrieve(fileName);
})

ipcMain.handle('delete', (_event, fileName: string) => {
  return deleteDB(fileName);
})

ipcMain.handle('retrieveAll', (_event) => {
  return retrieveAll();
})