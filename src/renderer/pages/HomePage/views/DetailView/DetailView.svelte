<script lang="ts">
  import type FileTree from "@/store/fileTree";
  import fileTreeStore from "@/store/fileTreeStore";
  import InfoPanel from "./components/InfoPanel.svelte";
  import OpenBtn from "./components/OpenBtn.svelte";
  import Search from "./components/Search.svelte";

  export let node: FileTree;

  const addIgnore = () => {
    fileTreeStore.addIgnore({ fullPath: node.fullPath, recursive: false });
  };
</script>

<div class="h-full overflow-y-auto" data-simplebar>
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
  <button class="btn" on:click={addIgnore}>
    <i class="bi bi-dash-circle" />
    <span>Ignore</span>
  </button>
</div>
