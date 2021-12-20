import { get, writable } from "svelte/store";
import { parse } from 'path';
import { join } from 'path';
import type { MovieInfo } from "./fileNode";
import { initFileNodes, appendMovieAPI, appendMovieDB, initIgnoreDB, readSingleFileNode, validateNode, filterFileNodes } from "./utils";
import type { IgnoreData } from "./ignore";

const path = "D:/OneDrive - stu.xjtu.edu.cn/Media/Movies";

const init = () => {
  const fileNodes = initFileNodes(path);
  return fileNodes.filter(node => validateNode(node));
}

function createFileNodeStore() {
  const ignoreList = writable<IgnoreData[]>([]);
  const fileNodes = writable(init());

  const importIgnoreDB = async (path: string) => {
    const dbItems = window.ignoreDBAPI.importDB(path);
    ignoreList.update(oldList => [...oldList, ...dbItems]);
    const newFileNodes = filterFileNodes(get(fileNodes), get(ignoreList));
    fileNodes.set(newFileNodes);
  }

  const importMovieDB = async (path: string) => {
    window.movieDBAPI.importDB(path);
    const newFileNodes = await appendMovieDB(get(fileNodes));
    fileNodes.set(newFileNodes);
  }

  const updateNode = (movieProp: MovieInfo, fullPath: string) =>
    fileNodes.update(oldNodes => {
      oldNodes.forEach(node => {
        if (node.fullPath === fullPath) {
          node.movie ?
            window.movieDBAPI.update(movieProp, parse(fullPath).name) :
            window.movieDBAPI.create(movieProp, parse(fullPath).name);
          node.movie = movieProp;
        }
      })
      return oldNodes;
    });

  const addIgnore = (newIgnore: IgnoreData) => {
    ignoreList.update(oldList => { oldList.push(newIgnore); return oldList; });
    fileNodes.update(oldNodes => oldNodes.filter(node => node.fullPath !== newIgnore.fullPath));
    return window.ignoreDBAPI.create(newIgnore);
  }

  const removeIgnore = (removeIgnore: IgnoreData) => {
    ignoreList.update(oldList =>
      oldList.filter(ignore => ignore.fullPath !== removeIgnore.fullPath)
    );
    const newNode = readSingleFileNode(removeIgnore.fullPath);
    appendMovieDB([newNode]).then(appendMovieAPI).then((movieNode) =>
      fileNodes.update(oldNodes => [...oldNodes, ...movieNode])
    );
    return window.ignoreDBAPI.delete(removeIgnore.fullPath);
  }

  const initIgnoreList = (newData: IgnoreData[]) => {
    ignoreList.set(newData);
    return newData;
  }

  /**
   * litsen to `rename` event, which will emit whenever a filename appears or disappears in the directory.
   * 
   * https://nodejs.org/api/fs.html#fswatchfilename-options-listener
   * 
   * when change happende, check if directory exists, if exists, create new fileNode, if not, delete original fileNode
   */
  const addDirLitsener = () =>
    window.fsAPI.addLitsener(path, (fileName) => {
      const changedPath = join(path, fileName);
      if (!get(ignoreList).find(ignore => ignore.fullPath === changedPath)) {
        const exist = window.fsAPI.existSync(changedPath);
        if (exist) {
          const newNode = readSingleFileNode(changedPath);
          if (validateNode(newNode)) {
            fileNodes.update(oldNodes => {
              oldNodes.push(newNode);
              return oldNodes;
            });
          }
        } else {
          fileNodes.update(oldNodes => oldNodes.filter(node => node.fullPath !== changedPath));
        }
      }
    });

  initIgnoreDB()
    .then(initIgnoreList)
    .then((ignoreItems) => filterFileNodes(get(fileNodes), ignoreItems))
    .then(appendMovieDB)
    .then(appendMovieAPI)
    .then(fileNodes.set);

  addDirLitsener();

  return {
    subscribe: fileNodes.subscribe,
    subscribeIgnore: ignoreList.subscribe,
    importIgnoreDB,
    importMovieDB,
    updateNode,
    addIgnore,
    removeIgnore,
  };
}

const fileNodeStore = createFileNodeStore();
export default fileNodeStore;
