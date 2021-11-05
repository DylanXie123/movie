import { writable } from "svelte/store";
import { parse } from 'path';
import type { MovieProp } from "../../fileNode";
import initFileNodes, { addLitsener, appendMovie, convertToDB, validateNode } from "./utils";

const path = "D:/OneDrive - stu.xjtu.edu.cn/Media/Movies/Marvel";

const init = () => {
  const fileNodes = initFileNodes(path);
  return fileNodes.filter(node => validateNode(node));
}

function createFileNodeStore() {
  const fileNodes = init();
  const { subscribe, set, update } = writable(fileNodes);

  const updateNode = async (movieProp: MovieProp, fullPath: string) =>
    update(oldNodes => {
      const dbNode = convertToDB(movieProp, parse(fullPath).name);
      const index = oldNodes.findIndex(node => node.fullPath === fullPath);
      if (oldNodes[index].movie === undefined) {
        window.dbAPI.create(dbNode);
      } else {
        window.dbAPI.update(dbNode);
      }
      oldNodes[index].movie = movieProp;
      return oldNodes;
    });


  appendMovie(fileNodes).then(newNodes => set(newNodes));
  addLitsener(path, update);

  return {
    subscribe,
    updateNode: updateNode,
  };
}

const fileNodeStore = createFileNodeStore();
export default fileNodeStore;
