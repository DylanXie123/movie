<script lang="ts">
  import fileNodeStore from "../store/fileNodeStore";
  import SearchBox from "./searchBox.svelte";
</script>

<div class="grid-container">
  {#each $fileNodeStore as node}
    <div class="d-grid gap-2">
      <img src={node.posterURL} alt={node.parsed.name} />
      <SearchBox {node} />
    </div>
  {/each}
</div>

<style>
  img {
    max-width: 100%;
  }
  .grid-container {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 20px;
    padding: 20px;
  }
</style>
