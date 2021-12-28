import { derived, writable } from "svelte/store";
import { parse } from "path";
import fileTreeStore from "./fileTreeStore";
import type FileTree from "./fileTree";
import selectedStore from "./selectStore";

const createColumnStore = () => {
  const columnStore = writable<FileTree[]>([]);
  const currentNode = derived(columnStore, $selectedStore => $selectedStore[$selectedStore.length - 1]);

  fileTreeStore.subscribeFileTree(fileTree => {
    columnStore.update(oldStore => {
      if (oldStore.length === 0) {
        return [fileTree];
      } else {
        oldStore[0] = fileTree;
        return oldStore;
      }
    })
  })

  const select = (node: FileTree) => {
    const parsed = parse(node.fullPath);
    columnStore.update(oldList => {
      const parentIndex = oldList.findIndex(item => item.fullPath === parsed.dir);
      if (parentIndex > -1) {
        const newList = oldList.slice(0, parentIndex + 1);
        newList.push(node);
        selectedStore.set(node);
        return newList;
      } else {
        return oldList;
      }
    })
  }

  return {
    subscribe: columnStore.subscribe,
    subscribeCurrent: currentNode.subscribe,
    select,
  }
}

const columnStore = createColumnStore();

export default columnStore;