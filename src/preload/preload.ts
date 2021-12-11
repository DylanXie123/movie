import { contextBridge } from 'electron';
import api_key from './api_key';
import { ignoreDBAPI, movieDBAPI } from './dbAPI';
import fsAPI from './fsAPI';

contextBridge.exposeInMainWorld('fsAPI', fsAPI);
contextBridge.exposeInMainWorld('api_key', api_key);
contextBridge.exposeInMainWorld('movieDBAPI', movieDBAPI);
contextBridge.exposeInMainWorld('ignoreDBAPI', ignoreDBAPI);

declare global {
  interface Window {
    fsAPI: typeof fsAPI;
    api_key: typeof api_key;
    movieDBAPI: typeof movieDBAPI;
    ignoreDBAPI: typeof ignoreDBAPI;
  }
}
