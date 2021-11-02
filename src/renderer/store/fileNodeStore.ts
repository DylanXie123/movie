import { writable } from "svelte/store";
import initFileNodes, { addLitsener, appendMovie, validateNode } from "./utils";

const path = "D:\\OneDrive - stu.xjtu.edu.cn\\Media\\Movies\\Amour (2012) [1080p] [BluRay] [5.1] [YTS.MX]";

const init = () => {
  const fileNodes = initFileNodes(path);
  return fileNodes.filter(node => validateNode(node));
}

function createFileNodeStore() {
  const fileNodes = init();
  const { subscribe, set, update } = writable(fileNodes);

  appendMovie(fileNodes).then(newNodes => set(newNodes));
  addLitsener(path, update);

  return {
    subscribe,
  };
}

const fileNodeStore = createFileNodeStore();
export default fileNodeStore;
