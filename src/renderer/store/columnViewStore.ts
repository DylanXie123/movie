import { derived, get, Readable, writable } from "svelte/store";
import { parse } from "path";
import fileTreeStore from "./fileTreeStore";
import type FileTree from "./fileTree";
import selectedStore from "./selectStore";
import filterStore, { FilterProp, recalcNodes } from "./filterStore";

const createColumnViewStore = (fileTreeStore: Readable<FileTree>, filterStore: Readable<FilterProp>) => {
  const selectedList = writable<FileTree[]>([get(fileTreeStore)]);
  const columnViewStore = derived([selectedList, filterStore], ([$selectedList, $filterStore]) => {
    const filtered = $selectedList.filter((node) => !node.isLeaf);
    const expanded = filtered.map((node) => Array.from(node.children!.values()));
    expanded[0] = recalcNodes(expanded[0], $filterStore);
    return expanded;
  });


  const select = (node: FileTree) => {
    const parsed = parse(node.fullPath);
    selectedList.update(oldList => {
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
    subscribe: columnViewStore.subscribe,
    select,
  }
}

const columnViewStore = createColumnViewStore(fileTreeStore, filterStore);

export default columnViewStore;