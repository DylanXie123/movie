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
      if (node.media) {
        nodes.push(node);
        return false;
      }
      if (!node.isLeaf) {
        const children = Array.from(node.children!.values());
        const validChildren = children.filter(validateNode);
        if (validChildren.length === 1) {
          nodes.push(node);
          return false;
        }
      }
      if (node.isLeaf && validateNode(node)) {
        nodes.push(node);
        return false
      }
      return true;
    });
    return nodes;
  }

  return {
    subscribe: filtered.subscribe,
  }
}

const gridViewStore = createGridViewStore(fileTreeStore, filterStore);

export default gridViewStore;