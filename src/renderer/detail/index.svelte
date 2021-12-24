<script lang="ts">
  import Search from "./components/search.svelte";
  import type FileNode from "../store/fileNode";
  import fileNodeStore from "../store/fileNodeStore";
  import MovieInfo from "./components/movieInfo.svelte";

  export let node: FileNode;

  const addIgnore = () => {
    // fileNodeStore.addIgnore({ fullPath: node.fullPath, recursive: false });
  };
</script>

<div class="h-100" style="overflow-x: hidden;" data-simplebar>
  <Search {node} />
  <div>
    {#if node.movie !== undefined}
      <MovieInfo {node} />
    {/if}
  </div>
  <div class="d-grid col-6 mx-auto">
    <button class="btn btn-secondary" on:click={addIgnore}>
      <i class="bi bi-dash-circle" />
      <span>Ignore</span>
    </button>
  </div>
</div>
