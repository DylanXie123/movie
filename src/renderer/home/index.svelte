<script lang="ts">
  import Image from "../image.svelte";

  import fileNodeStore from "../store/fileNodeStore";
  import SearchBox from "./searchBox.svelte";
</script>

<div class="grid-container">
  {#each $fileNodeStore as node}
    <div class="d-grid gap-2">
      <Image
        src={node.posterURL}
        alt={node.parsed.name}
        path={node.movie?.tmdbID.toString()}
      />
      <SearchBox {node} />
    </div>
  {/each}
</div>

<style>
  .grid-container {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 20px;
    padding: 20px;
  }
</style>
