import { derived, get, Subscriber, Unsubscriber, writable } from "svelte/store";
import { parse } from 'path';
import type { FileTree, MovieInfo } from "./fileNode";
import { appendMovieAPI, appendMovieDB, initIgnoreDB, readSingleFileNode, filterFileTree, readFileTree, validateNode } from "./utils";
import type { IgnoreData } from "./ignore";
import type FileNode from "./fileNode";

const path = "D:/OneDrive - stu.xjtu.edu.cn/Media/Movies/Marvel";

function createFileNodeStore() {
  const ignoreList = writable<IgnoreData[]>([]);
  const fileTree = writable(readFileTree(path));
  const fileNodes = derived(fileTree, $fileTree => {
    const nodes: FileTree[] = [];
    $fileTree.forEachWithStop(node => {
      if (!node.isLeaf && node.movie === undefined) {
        return true;
      } else {
        nodes.push(node);
        return false;
      }
    });
    const filtered = nodes.filter(node =>
      node.children ? true : validateNode(node)
    );
    return filtered;
  });

  const importIgnoreDB = async (path: string) => {
    const dbItems = window.ignoreDBAPI.importDB(path);
    ignoreList.update(oldList => [...oldList, ...dbItems]);
    const newFileNodes = filterFileTree(get(fileTree), get(ignoreList));
    fileTree.set(newFileNodes);
  }

  const importMovieDB = async (path: string) => {
    window.movieDBAPI.importDB(path);
    const newFileNodes = await appendMovieDB(get(fileTree));
    fileTree.set(newFileNodes);
  }

  const updateNode = (movieProp: MovieInfo, fullPath: string) =>
    fileTree.update(oldNodes => {
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

  // const addIgnore = (newIgnore: IgnoreData) => {
  //   ignoreList.update(oldList => { oldList.push(newIgnore); return oldList; });
  //   fileTree.update(oldNodes => oldNodes.filter(node => node.fullPath !== newIgnore.fullPath));
  //   return window.ignoreDBAPI.create(newIgnore);
  // }

  // const removeIgnore = (removeIgnore: IgnoreData) => {
  //   ignoreList.update(oldList =>
  //     oldList.filter(ignore => ignore.fullPath !== removeIgnore.fullPath)
  //   );
  //   const newNode = readSingleFileNode(removeIgnore.fullPath);
  //   appendMovieDB([newNode]).then(appendMovieAPI).then((movieNode) =>
  //     fileTree.update(oldNodes => [...oldNodes, ...movieNode])
  //   );
  //   return window.ignoreDBAPI.delete(removeIgnore.fullPath);
  // }

  const initIgnoreList = (newData: IgnoreData[]) => {
    ignoreList.set(newData);
    return newData;
  }

  // /**
  //  * litsen to `rename` event, which will emit whenever a filename appears or disappears in the directory.
  //  * 
  //  * https://nodejs.org/api/fs.html#fswatchfilename-options-listener
  //  * 
  //  * when change happende, check if directory exists, if exists, create new fileNode, if not, delete original fileNode
  //  */
  // const addDirLitsener = () =>
  //   window.fsAPI.addLitsener(path, (fileName) => {
  //     const changedPath = join(path, fileName);
  //     if (!get(ignoreList).find(ignore => ignore.fullPath === changedPath)) {
  //       const exist = window.fsAPI.existSync(changedPath);
  //       if (exist) {
  //         const newNode = readSingleFileNode(changedPath);
  //         if (validateNode(newNode)) {
  //           fileNodes.update(oldNodes => {
  //             oldNodes.push(newNode);
  //             return oldNodes;
  //           });
  //         }
  //       } else {
  //         fileNodes.update(oldNodes => oldNodes.filter(node => node.fullPath !== changedPath));
  //       }
  //     }
  //   });

  initIgnoreDB()
    .then(initIgnoreList)
    .then((ignoreItems) => filterFileTree(get(fileTree), ignoreItems))
    .then(appendMovieDB)
    // .then(appendMovieAPI)
    .then(fileTree.set);

  // addDirLitsener();

  return {
    subscribe: fileNodes.subscribe,
    subscribeIgnore: ignoreList.subscribe,
    importIgnoreDB,
    importMovieDB,
    updateNode,
    // addIgnore,
    // removeIgnore,
  };
}

const fileNodeStore = createFileNodeStore();
export default fileNodeStore;
