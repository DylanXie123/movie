import { contextBridge } from 'electron';
import api_key from './api_key';
import { ignoreDBAPI, movieDBAPI, storageAPI } from './dbAPI';
import electronAPI from './electronAPI';
import fsAPI from './fsAPI';

contextBridge.exposeInMainWorld('fsAPI', fsAPI);
contextBridge.exposeInMainWorld('api_key', api_key);
contextBridge.exposeInMainWorld('movieDBAPI', movieDBAPI);
contextBridge.exposeInMainWorld('ignoreDBAPI', ignoreDBAPI);
contextBridge.exposeInMainWorld('storageAPI', storageAPI);
contextBridge.exposeInMainWorld('electronAPI', electronAPI);

// https://github.com/electron/electron/issues/9920#issuecomment-575839738
declare global {
  interface Window {
    fsAPI: typeof fsAPI;
    api_key: typeof api_key;
    movieDBAPI: typeof movieDBAPI;
    ignoreDBAPI: typeof ignoreDBAPI;
    storageAPI: typeof storageAPI;
    electronAPI: typeof electronAPI;
  }
}
