import { get, writable } from "svelte/store";
import { parse } from 'path';
import { join } from 'path';
import type { MovieProp } from "../../fileNode";
import initFileNodes, { appendMovieAPI, appendMovieDB, convertToDB, initIgnoreDB, readSingleFileNode, validateNode } from "./utils";
import type { IgnoreData } from "../../main/ignoreDB";

const path = "D:/OneDrive - stu.xjtu.edu.cn/Media/Movies";

const init = () => {
  const fileNodes = initFileNodes(path);
  return fileNodes.filter(node => validateNode(node));
}

function createFileNodeStore() {
  const ignoreList = writable<IgnoreData[]>([]);
  const fileNodes = writable(init());

  const importIgnoreDB = (path: string) =>
    window.ignoreDBAPI.importDB(path)
      .then((newList) => {
        ignoreList.update(oldList => [...oldList, ...newList]);
        return get(ignoreList);
      })
      .then(filterFileNodes)
      .then(newNodes => fileNodes.set(newNodes));

  const importMovieDB = (path: string) =>
    window.movieDBAPI.importDB(path)
      .then(() => appendMovieDB(get(fileNodeStore)))
      .then(nodes => fileNodes.set(nodes));

  const updateNode = (movieProp: MovieProp, fullPath: string) =>
    fileNodes.update(oldNodes => {
      const dbNode = convertToDB(movieProp, parse(fullPath).name);
      oldNodes.forEach(node => {
        if (node.fullPath === fullPath) {
          node.movie ?
            window.movieDBAPI.update(dbNode) :
            window.movieDBAPI.create(dbNode);
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

  const filterFileNodes = (ignoreList: IgnoreData[]) => {
    fileNodes.update(oldNodes => oldNodes.filter(node =>
      !ignoreList.find(item => item.fullPath === node.fullPath)
    ));
    return get(fileNodes);
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
    .then(filterFileNodes)
    .then(filtered => appendMovieDB(filtered))
    .then(filtered => appendMovieAPI(filtered))
    .then(newNodes => fileNodes.set(newNodes));

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
