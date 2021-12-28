<script lang="ts">
  import type FileTree from "../../store/fileTree";

  export let node: FileTree;

  const play = () => window.fsAPI.openFile(node.fullPath);

  const openFolder = () => window.fsAPI.openFile(node.parsed.dir);
</script>

<div class="d-grid gap-2 px-4">
  {#if node.onDisk}
    <button class="btn btn-primary rounded-pill" on:click={play}>
      <i class="bi bi-play-circle-fill" />
      <span>Watch</span>
    </button>
  {:else}
    <button class="btn btn-primary rounded-pill disabled">
      <i class="bi bi-x-circle-fill" />
      <span>Unavailable</span>
    </button>
  {/if}
  <button class="btn btn-primary rounded-pill" on:click={openFolder}>
    <i class="bi bi-folder2-open" />
    <span>Folder</span>
  </button>
</div>
