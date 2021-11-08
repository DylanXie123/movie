import { writable } from "svelte/store";
import { parse } from 'path';
import type { MovieProp } from "../../fileNode";
import initFileNodes, { addLitsener, appendMovie, convertToDB, initIgnoreDB, validateNode } from "./utils";
import type { IgnoreData } from "../../main/ignoreDB";

const path = "D:/OneDrive - stu.xjtu.edu.cn/Media/Movies/Marvel";

const init = () => {
  const fileNodes = initFileNodes(path);
  return fileNodes.filter(node => validateNode(node));
}

function createFileNodeStore() {
  const fileNodes = init();
  let ignoreList: IgnoreData[] = [];
  const { subscribe, set, update } = writable(fileNodes);

  const updateNode = async (movieProp: MovieProp, fullPath: string) =>
    update(oldNodes => {
      const dbNode = convertToDB(movieProp, parse(fullPath).name);
      const index = oldNodes.findIndex(node => node.fullPath === fullPath);
      if (oldNodes[index].movie === undefined) {
        window.movieDBAPI.create(dbNode);
      } else {
        window.movieDBAPI.update(dbNode);
      }
      oldNodes[index].movie = movieProp;
      return oldNodes;
    });

  const updateIgnoreDB = (newData: IgnoreData[]) => {
    ignoreList = newData;
    return newData;
  }

  const filterNode = (ignoreDB: IgnoreData[]) =>
    fileNodes.filter(node =>
      !ignoreDB.find(item => item.fullPath === node.fullPath)
    );

  initIgnoreDB()
    .then(updateIgnoreDB)
    .then(filterNode)
    .then(filtered => appendMovie(filtered))
    .then(newNodes => set(newNodes));

  addLitsener(path, ignoreList, update);

  return {
    subscribe,
    updateNode: updateNode,
  };
}

const fileNodeStore = createFileNodeStore();
export default fileNodeStore;
