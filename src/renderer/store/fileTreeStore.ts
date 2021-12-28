import { get, writable } from "svelte/store";
import { appendMovieDB, initIgnoreDB, filterFileTree, readFileTree, getNodeDBIndex } from "./utils";
import type { IgnoreData } from "./ignore";
import type { MediaInfo } from "./media";
import type FileTree from "./fileTree";

const path = "D:/OneDrive - stu.xjtu.edu.cn/Media/Movies";

function createFileTreeStore() {
  const ignoreList = writable<IgnoreData[]>([]);
  const fileTree = writable(readFileTree(path));

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

  const updateNode = (node: FileTree, newData: MediaInfo) =>
    fileTree.update(oldTree => {
      const query = oldTree.query(node.fullPath);
      if (query) {
        query.media = newData;
        window.movieDBAPI.create(newData.convertToDB(getNodeDBIndex(query)));
      }
      return oldTree;
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
    subscribe: fileTree.subscribe,
    subscribeFileTree: fileTree.subscribe,
    subscribeIgnore: ignoreList.subscribe,
    importIgnoreDB,
    importMovieDB,
    updateNode,
    // addIgnore,
    // removeIgnore,
  };
}

const fileTreeStore = createFileTreeStore();
export default fileTreeStore;
