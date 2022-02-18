<script lang="ts">
  import type FileTree from "@/store/fileTree";
  import { validateNode } from "@/store/utils";

  export let node: FileTree;

  const play = () => {
    if (node.isLeaf) {
      window.fsAPI.openPath(node.fullPath);
    } else {
      const children = Array.from(node.children!.values()).filter(validateNode);
      window.fsAPI.openPath(children[0].fullPath);
    }
  };

  const openFolder = () => {
    window.fsAPI.showItem(node.fullPath);
  };
</script>

<div class="px-4">
  {#if node.onDisk}
    <button class="btn rounded-full" on:click={play}>
      <i class="bi bi-play-circle-fill" />
      <span>Watch</span>
    </button>
  {:else}
    <button class="btn rounded-full">
      <i class="bi bi-x-circle-fill" />
      <span>Unavailable</span>
    </button>
  {/if}
  <button class="btn rounded-full mt-2" on:click={openFolder}>
    <i class="bi bi-folder2-open" />
    <span>Folder</span>
  </button>
</div>
