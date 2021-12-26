<script lang="ts">
  import { onDestroy } from "svelte";
  import type { FileTree } from "../../store/fileNode";
  import selectedStore from "../../store/selectStore";

  let treeColumns: FileTree[][];
  let current: FileTree;

  const unSubscribeSelect = selectedStore.subscribe((tree) => {
    const filtered = tree.filter((node) => !node.isLeaf);
    treeColumns = filtered.map((node) => Array.from(node.children!.values()));
  });

  const unSubscribeFileTree = selectedStore.subscribeCurrent((tree) => {
    current = tree;
  });

  onDestroy(() => {
    unSubscribeSelect();
    unSubscribeFileTree();
  });
</script>

<div class="h-100 overflow-auto" data-simplebar>
  <div class="d-flex container-fluid">
    {#each treeColumns as nodes}
      <div class="flex-grow-1" style="min-width: 0;">
        <div class="list-group list-group-flush">
          {#each nodes as child}
            <button
              class="list-group-item list-group-item-dark list-group-item-action text-nowrap"
              title={child.parsed.base}
              on:click={() => selectedStore.select(child)}
            >
              <div style="text-overflow:ellipsis; overflow:hidden;">
                {child.parsed.base}
              </div>
            </button>
          {/each}
        </div>
      </div>
    {/each}
  </div>
</div>
