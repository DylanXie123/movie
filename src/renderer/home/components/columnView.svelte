<script lang="ts">
  import { onDestroy } from "svelte";
  import columnStore from "../../store/columnStore";
  import type FileTree from "../../store/fileTree";

  let treeColumns: FileTree[][];

  const unSubscribeSelect = columnStore.subscribe((tree) => {
    const filtered = tree.filter((node) => !node.isLeaf);
    treeColumns = filtered.map((node) => Array.from(node.children!.values()));
  });

  onDestroy(unSubscribeSelect);
</script>

<div class="h-100">
  <div class="d-flex container-fluid h-100">
    {#each treeColumns as nodes}
      <div
        class="flex-grow-1 overflow-auto"
        style="min-width: 0;"
        data-simplebar
      >
        <div class="list-group list-group-flush">
          {#each nodes as child}
            <button
              class="list-group-item list-group-item-dark list-group-item-action text-nowrap"
              title={child.parsed.base}
              on:click={() => columnStore.select(child)}
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
