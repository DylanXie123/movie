<script lang="ts">
  import type FileTree from "renderer/store/fileTree";
  import fileTreeStore from "renderer/store/fileTreeStore";
  import InfoPanel from "renderer/components/InfoPanel.svelte";
  import OpenBtn from "renderer/components/OpenBtn.svelte";
  import Search from "renderer/components/Search.svelte";

  export let node: FileTree;

  const addIgnore = () => {
    fileTreeStore.addIgnore({ fullPath: node.fullPath, recursive: false });
  };
</script>

<div class="h-100" style="overflow-x: hidden;" data-simplebar>
  <Search {node} />
  <div>
    {#if node.media !== undefined}
      <InfoPanel {node} />
    {:else}
      <div class="mb-2">
        <OpenBtn {node} />
      </div>
    {/if}
  </div>
  <div class="d-grid col-6 mx-auto">
    <button class="btn btn-secondary" on:click={addIgnore}>
      <i class="bi bi-dash-circle" />
      <span>Ignore</span>
    </button>
  </div>
</div>
