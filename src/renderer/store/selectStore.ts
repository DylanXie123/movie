import { derived, get, writable } from "svelte/store";
import type { FileTree } from "./fileNode";
import { parse } from "path";
import fileNodeStore from "./fileNodeStore";


const createSelectStore = () => {
  const selectedStore = writable<FileTree[]>([]);
  const detaileNode = derived(selectedStore, $selectedStore => {
    for (let index = $selectedStore.length - 1; index > -1; index--) {
      const node = $selectedStore[index];
      if (node.movie) return node
    }
    return undefined;
  });
  const currentNode = derived(selectedStore, $selectedStore => $selectedStore[$selectedStore.length - 1]);

  fileNodeStore.subscribeFileTree(fileTree => {
    selectedStore.update(oldStore => {
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
    selectedStore.update(oldList => {
      const parentIndex = oldList.findIndex(item => item.fullPath === parsed.dir);
      if (parentIndex > -1) {
        const newList = oldList.slice(0, parentIndex + 1);
        newList.push(node);
        return newList;
      } else {
        return oldList;
      }
    })
  }

  return {
    subscribe: selectedStore.subscribe,
    subscibeDetail: detaileNode.subscribe,
    subscribeCurrent: currentNode.subscribe,
    select,
  }
}

const selectedStore = createSelectStore();

export default selectedStore;