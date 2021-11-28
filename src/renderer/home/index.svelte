<script lang="ts">
  import fileNodeStore from "../store/fileNodeStore";
  import MovieContainer from "./movieContainer.svelte";
</script>

<button on:click={fileNodeStore.shuffleFileNodes} class="btn btn-primary">
  Shuffle
</button>
<div class="container">
  <div class="row g-4">
    {#each $fileNodeStore as node (node.fullPath)}
      <MovieContainer {node} />
    {/each}
  </div>
</div>
