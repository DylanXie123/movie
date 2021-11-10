<script lang="ts">
  import fileNodeStore from "../store/fileNodeStore";
  import MovieContainer from "./movieContainer.svelte";
</script>

<div class="container">
  <div class="row g-2">
    {#each $fileNodeStore as node}
      <MovieContainer {node} />
    {/each}
  </div>
</div>
