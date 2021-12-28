<script lang="ts">
  import type FileTree from "../store/fileTree";
  import InfoPanel from "./components/InfoPanel.svelte";
  import OpenBtn from "./components/openBtn.svelte";
  import Search from "./components/search.svelte";

  export let node: FileTree;

  const addIgnore = () => {
    // fileNodeStore.addIgnore({ fullPath: node.fullPath, recursive: false });
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
