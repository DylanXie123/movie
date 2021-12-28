import { derived, Readable } from "svelte/store";
import type FileTree from "./fileTree";
import fileTreeStore from "./fileTreeStore";
import filterStore, { FilterProp, recalcNodes } from "./filterStore";
import { validateNode } from "./utils";

const createGridViewStore = (fileTreeStore: Readable<FileTree>, filterStore: Readable<FilterProp>) => {
  const gridViewStore = derived(fileTreeStore, flatTree);
  const filtered = derived([gridViewStore, filterStore],
    ([$gridViewStore, $filterStore]) => recalcNodes($gridViewStore, $filterStore)
  );

  function flatTree(tree: FileTree) {
    const nodes: FileTree[] = [];
    tree.forEachWithStop(node => {
      if (!node.isLeaf && node.media === undefined) {
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
  }

  return {
    subscribe: filtered.subscribe,
  }
}

const gridViewStore = createGridViewStore(fileTreeStore, filterStore);

export default gridViewStore;